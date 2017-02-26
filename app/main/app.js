import { app } from 'electron';
import { join } from 'path';
import { sync as mkdirp } from 'mkdirp';

export const getAppDir = (name = null) => {
  const appDataDir = app.getPath('appData');
  const dir = join(appDataDir, 'automata');
  mkdirp(dir);
  if (name !== null) {
    const subdir = join(dir, name);
    mkdirp(subdir);
    return subdir;
  }
  return dir;
};
