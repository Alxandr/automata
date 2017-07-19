import devConfig from './webpack.config.development';
import electronPath from 'electron';
import express from 'express';
import path from 'path';
import { spawn } from 'child_process';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import yargs from 'yargs';

const argv = yargs
  .usage('start [options] ...tasks')
  .option('verbose', {
    describe: 'increase verbosity',
    default: 0,
    type: 'count',
    alias: 'v',
  })
  .option('port', {
    describe: 'port to bind on',
    default: process.env.PORT || 5000,
    type: 'number',
  })
  .help()
  .argv;

const lazy = fn => {
  let get = () => {
    const val = fn();
    get = () => val;
    return val;
  };

  return () => get();
};

const task = (name, signals, fn) => {
  const sigObj = {};
  const root = lazy(() => {
    console.log(`Starting ${name}.`);
    try {
      const val = fn(sigObj);
      return Promise.resolve(val).then(v => {
        console.log(`Finished ${name}.`);
        return v;
      }).catch(e => {
        console.log(`Failed ${name}.`);
        return Promise.reject(e);
      });
    } catch (e) {
      console.log(`Failed ${name}.`);
      return Promise.reject(e);
    }
  });

  for (const sig of signals) {
    const symbol = Symbol(sig);
    let resolve;
    const promise = new Promise(res => { resolve = res; }).then(v => {
      console.log(`Signal ${name}:${sig}.`);
      return v;
    });
    sigObj[sig] = v => { console.log(`Trigger signal ${name}:${sig}.`); resolve(v); };
    root[sig] = lazy(() => {
      return root().then(() => promise);
    });
  }

  return root;
};

const env = task('env', [], () => {
  process.env.HOT = '1';
  process.env.PORT = argv.port;
  process.env.NODE_ENV = 'development';
});

const server = task('server', ['up', 'ready'], (signals) => {
  const app = express();
  const mw = webpackMiddleware(webpack(devConfig), {
    publicPath: devConfig.output.publicPath,

    stats: {
      colors: true
    },
  });

  app.use(mw);
  app.listen(argv.port, () => {
    signals.up();
  });
  mw.waitUntilValid(() => {
    signals.ready();
  });
});

const app = task('app', ['close'], async (signals) => {
  await env();
  await server.ready();

  const child = spawn(electronPath, [
    '--inspect',
    //'--enable-logging',
    '-r', 'babel-register',
    '-r', 'babel-polyfill',
    path.resolve('./app')], { stdio: 'inherit', encoding: 'utf-8', env: process.env, });

  child.on('close', signals.close);
});

const runTasks = tasks =>
  Promise.all(tasks.map(f => f()))
    .catch(e => {
      console.error(e.stack);
      process.exit(1);
    }).then(() => {
      console.log('All done.');
      process.exit(0)
    });

runTasks([app.close]);
