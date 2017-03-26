import { END, eventChannel } from 'redux-saga';
import { call, put, take } from 'redux-saga/effects';

import { createCookieString } from '../factorio/api';
import { createWriteStream } from 'fs';
import { get as getHttp } from 'http';
import { get as getHttps } from 'https';
import { parse } from 'url';
import progress from 'progress-stream';

let dlCount = 0;
let done = 0;

const createDownloadChannel = (url, file, session) => eventChannel(emmit => {
  const uri = parse(url);
  const cookies = session !== null ? createCookieString(session) : null;
  const opts = {
    protocol: uri.protocol,
    hostname: uri.host,
    port: uri.port,
    method: 'GET',
    path: uri.path,
    headers: cookies === null ? {} : { 'cookie': cookies },
  };

  const handle = res => {
    if (res.statusCode > 300 && res.statusCode < 400) {
      // Redirect
      const { location } = res.headers;
      res.destroy();

      const uri = parse(location);
      opts.protocol = uri.protocol || opts.protocol;
      opts.hostname = uri.host || opts.hostname;
      opts.port = uri.port || opts.port;
      opts.path = uri.path || opts.path;
      start();
      return;
    }

    const length = res.headers['content-length'];
    console.log(`Download size: ${length}`);

    const progressPipe = progress({
      time: 1000,
      length
    });
    progressPipe.on('progress', progress => {
      emmit({
        type: 'PROGRESS',
        payload: progress
      });
    });

    res
      .on('error', err => {
        emmit({
          type: 'ERROR',
          payload: err
        });
      })
      .pipe(progressPipe)
      .pipe(file)
      .on('error', err => {
        emmit({
          type: 'ERROR',
          payload: err
        });
      }).on('finish', () => {
        emmit({
          type: 'DONE'
        });
      });
  };

  const start = () => {
    console.log('download:', opts, 'protocol:', opts.protocol);
    const get = opts.protocol === 'http:' ? getHttp : getHttps;
    const request = get(opts);
    request.on('response', handle);
  };

  start();

  return () => {
    request.abort();
  };
});

const setProgress = function* setProgress(window, num) {
  yield put({
    type: 'WINDOW_PROGRESS',
    payload: num,
    meta: { window }
  });
}

export default function* downloadFile(window, url, path, session = null) {
  dlCount += 1;
  const file = createWriteStream(path);
  try {
    const channel = createDownloadChannel(url, file, session);
    while (true) {
      const evt = yield take(channel);
      if (evt.type === 'DONE') {
        done += 1;
        if (done === dlCount) {
          dlCount = 0;
          done = 0;
          yield call(setProgress, window, -1);
        } else {
          yield call(setProgress, window, done / dlCount);
        }
        // TODO: Return correct stuffs
        return;
      }

      if (evt.type === 'ERROR') {
        throw evt.payload;
      }

      const { percentage } = evt.payload;
      const progress = percentage / 100;
      yield call(setProgress, window, (done + progress) / dlCount);
    }
  } finally {
    file && file.close();
  }
}
