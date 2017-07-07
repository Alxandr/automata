import * as path from 'path';

import Start from 'start';
import concurrent from 'start-concurrent';
import devConfig from './webpack.config.development';
import env from 'start-env';
import { platform } from 'os';
import reporter from 'start-pretty-reporter';
import { spawn as spawnChild } from 'child_process';
import webpackDevServer from 'start-webpack-dev-server';

const start = Start(reporter());
const port = process.env.PORT || 5000;

const delay = (timeout) => () => new Promise(resolve => setTimeout(resolve, timeout));

const spawn = (bin, ...args) => () => new Promise((resolve, reject) => {
  switch (platform()) {
    case 'win32':
      bin = path.join(__dirname, 'node_modules', '.bin', 'electron.cmd');
      args.unshift('/c', bin);
      bin = 'cmd';
      break;
    default:
      bin = path.join(__dirname, 'node_modules', '.bin', bin);
      break;
  }
  console.log(`${bin} ${args.map(a => `'${a}'`).join(' ')}`);
  const proc = spawnChild(bin, args, {
    detached: false,
    //stdio: [ 'pipe', 'pipe', 'pipe' ]
  });
  proc.stdout.pipe(process.stdout);
  proc.stderr.pipe(process.stderr);
  proc.on('error', () => reject('Error ...'));
  setTimeout(resolve, 1000);
});

export const devServer = () => start(
  webpackDevServer(devConfig, { publicPath: devConfig.output.publicPath }, { port }),
  () => {
    console.log(`Listening on ${port}.`); // eslint-disable-line no-console
    return Promise.resolve();
  }
);

export const startHot = () => start(
  env('HOT', '1'),
  delay(5000),
  spawn('electron', '--enable-logging', '-r', 'babel-register', '-r', 'babel-polyfill', path.resolve('./app'))
);

export const dev = () => start(
  env('NODE_ENV', 'development'),
  concurrent(devServer, startHot)
);
