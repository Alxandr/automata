import * as fs from 'fs';

export const exists = (path) => new Promise((res) => {
  fs.exists(path, res);
});
