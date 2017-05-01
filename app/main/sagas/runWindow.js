import { BrowserWindow, ipcMain } from 'electron';
import { END, delay, eventChannel } from 'redux-saga';
import { cancel, fork, join, put, race, setContext, take } from 'redux-saga/effects';
import { exit, init, lock, unlock } from '@shared/window';

// setup windows stack
const windows = new Map();
const nextId = (() => {
  let next = 0;
  return () => ++next;
})();

const getOpts = ({ modal = false, module, path, width, height, parent }) => {
  if (!module) {
    throw new Error('No module given.');
  }

  if (!path) {
    path = '/';
  }

  let parentId = null;
  if (typeof parent === 'number') {
    parentId = parent;
    parent = windows.get(parent) || null;
  }

  return [ module, path, parentId, { modal, width, height, parent } ];
};

const resolveEmpty = resolve => () => resolve();

function* waitForClose(window, id) {
  windows.set(id, window);
  const channel = eventChannel(emitter => {
    let live = true;

    const cleanup = () => {
      if (live) {
        windows.delete(id);
        window.removeListener('closed', closeHandler);
        ipcMain.removeListener(`window-${id}-done`, doneHandler);
        ipcMain.removeListener('window-get-id', idHandler);
      }
    };

    const closeHandler = () => {
      cleanup();
      if (live) {
        emitter(['closed']);
        emitter(END);
        live = false;
      }
    };

    const doneHandler = (_evt, exit, result) => {
      cleanup();
      if (live) {
        emitter([ exit, result ]);
        emitter(END);
        live = false;
      }
    };

    const idHandler = (evt) => {
      if (live && evt.sender === window.webContents) {
        evt.returnValue = id;
      }
    };

    const unregister = () => {
      cleanup();
      live = false;
    };

    window.on('closed', closeHandler);
    ipcMain.on(`window-${id}-done`, doneHandler);
    ipcMain.on('window-get-id', idHandler);
    return unregister;
  });

  try {
    return yield take(channel);
  } finally {
    window.destroy();
    yield put(exit(id));
  }
}

export function* infiniteSaga() {
  const channel = eventChannel(() => () => {});
  yield take(channel);
}

export const doWithWindow = (id, fn) => {
  const win = windows.get(id);
  if (win) {
    fn(win);
  }
};

function* progress(win, winId) {
  while (true) {
    const action = yield take(({ type, meta }) => type === 'WINDOW_PROGRESS' && meta && meta.window === winId);
    const progress = action.payload;
    win.setProgressBar(progress);
  }
}

function* runWindow(options, saga) {
  const [ module, path, parent, opts ] = getOpts(options);
  const id = nextId();

  // Create router entry
  // TODO: Replace with generic "@window/INIT"
  yield put(init(module, path, id));

  if (parent) {
    yield put(lock(parent));
  }

  // Create browser window
  const window = new BrowserWindow({
    ...opts,
    show: false,
    useContentSize: true
  });

  let hasError = true;
  try {
    // create window task
    const windowTask = yield fork(waitForClose, window, id);

    // load boot html file
    window.loadURL(`file://${__dirname}/../../app.html`);
    //window.show();

    // create wait for render promise
    const renderP = new Promise(resolve => {
      ipcMain.once(`window-${id}-ready`, resolveEmpty(resolve));
    });

    // wait for content loaded
    yield new Promise(resolve => {
      window.webContents.once('did-finish-load', resolveEmpty(resolve));
    });

    // wait for render promise
    if (process.env.NODE_ENV === 'development') {
      // if dev, timeout at 1 sec (as it might have crashed).
      console.log('start dev race');
      yield race({
        r: renderP,
        o: delay(1000)
      });
    } else {
      console.log(`env: ${process.env.NODE_ENV}`);
      yield renderP;
    }

    // show window
    if (parent) {
      yield put(unlock(parent));
    }
    window.show();
    window.focus();

    // mark as completed (so it doesn't get destroyed in finally)
    hasError = false;

    // set windowId in context
    yield setContext({ windowId: id });

    // create saga task
    const sagaTask = yield fork(saga, id);

    // create progress task
    const progressTask = yield fork(progress, window, id);

    // wait for either window close or saga completion
    const result = yield race({
      close: join(windowTask),
      done: join(sagaTask)
    });

    // cancel remaining task
    yield cancel(progressTask);
    yield cancel(sagaTask);
    yield cancel(windowTask);

    // if there is an result, return it
    if (result.done) {
      // TODO: ensure array
      return result.done;
    } else {
      return ['close'];
    }
  } finally {
    if (hasError) {
      window.destroy();
    }
  }
}

function* startWindow(options, saga = infiniteSaga) {
  return yield fork(runWindow, options, saga);
}
export default startWindow;
