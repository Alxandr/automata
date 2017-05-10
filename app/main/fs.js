import * as fs from 'fs';

import { osName } from './app';

export const exists = (path) => new Promise((res) => {
  fs.exists(path, res);
});

export const write = (path, content) => new Promise((res, rej) => {
  fs.writeFile(path, content, { encoding: 'utf-8' }, (err) => {
    if (err) {
      return rej(err);
    }

    res();
  });
});

export const isDir = (path) => new Promise((res, rej) => {
  fs.stat(path, (err, stat) => {
    if (err) {
      return rej(err);
    }

    res(stat.isDirectory());
  });
});

export const numFiles = async (path, filter = _name => true) => {
  if (!await exists(path)) return 0;
  if (!await isDir(path)) return 0;

  const content = await new Promise((res, rej) => {
    fs.readdir(path, (err, files) => {
      if (err) {
        return rej(err);
      }

      res(files);
    });
  });

  return content.filter(filter).length;
};

export const link = async (linkLocation, linkTarget) => {
  if (!(await isDir(linkTarget))) {
    throw new Error(`${linkTarget} is not a directory`);
  }

  await new Promise((res, rej) => {
    fs.symlink(linkTarget, linkLocation, 'junction', (err) => {
      if (err) {
        rej(err);
        return;
      }

      res();
    });
  });
};
