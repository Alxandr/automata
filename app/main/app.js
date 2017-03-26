import * as os from 'os';

import { app } from 'electron';
import { join } from 'path';
import { sync as mkdirp } from 'mkdirp';

export const getAppDir = (...dirs) => {
  const appDataDir = app.getPath('appData');
  const dir = join(appDataDir, 'automata');
  mkdirp(dir);
  let subdir = dir;
  for (let dirName of dirs) {
    subdir = join(subdir, dirName);
    mkdirp(subdir);
  }

  return subdir;
};

export const osName = (() => {
  const type = os.type();
  switch (type) {
    case 'Darwin': return 'osx';
    case 'Windows_NT': return 'win';
    case 'Linux': return 'linux';
    default:
      console.error(`Unknown OS name ${type}, defaulting to linux.`); // eslint-disable-line no-console
      return 'linux';
  }
})();
