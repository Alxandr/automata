import { readdir as _readdir, rename as _rename, stat as _stat, createReadStream } from 'fs';

import { Extract } from 'unzip';
import copy from 'recursive-copy';
import { join as joinPath } from 'path';
import { osName } from '../app';
import { resolve } from 'path';
import { spawn } from 'child_process';

const stat = path => new Promise((resolve, reject) => {
  _stat(path, (err, stat) => {
    if (err) reject(err);
    else resolve(stat);
  });
});

const readdir = path => new Promise((resolve, reject) => {
  _readdir(path, (err, stat) => {
    if (err) reject(err);
    else resolve(stat);
  });
});

const rename = (from, to) => new Promise((resolve, reject) => {
  _rename(from, to, (err) => {
    if (err) reject(err);
    else resolve();
  });
});

const unzipTo = (zip, targetDir) => new Promise((resolve, reject) => {
  createReadStream(zip)
    .pipe(Extract({
      path: targetDir
    }))
    .on('error', e => reject(e))
    .on('close', () => resolve());
});

const isDir = async path => {
  try {
    const fstat = await stat(path);
    return fstat.isDirectory();
  } catch (e) {
    if (e.errno === 34) return false;
    throw e;
  }
};

const run = (cmd, ...args) => new Promise(resolve => {
  let stdout = '';
  let stderr = '';
  const proc = spawn(cmd, args);
  proc.stdout.on('data', data => {
    stdout += data;
  });
  proc.stderr.on('data', data => {
    stderr += data;
  });
  proc.on('close', (code, signal) => {
    resolve({
      code,
      signal,
      stdout,
      stderr
    });
  });
});

const mount_dmg = async path => {
  path = resolve(path);
  console.log('Mounting:', path);
  const { code, stdout } = await run('hdiutil', 'attach', path);
  if (code !== 0) {
    throw new Error('Process exited with non-zero exit code.');
  }

  const lines = stdout.split('\n');
  const volumes = lines.map(l => {
    const match = /(\/dev\/disk\d+s\d+)\s+.+?\s(\/Volumes\/.+)$/.exec(l);
    if (!match) {
      return null;
    }

    return {
      mount: match[1],
      path: match[2]
    };
  }).filter(v => v !== null);

  console.log('Mounted volumes:', volumes);
  return volumes;
};

const unmount_dmg = async volumes => {
  for (const vol of volumes) {
    console.log('Unmounting:', vol);
    await run('hdiutil', 'detach', vol.mount);
  }
};

const unpack_osx = async (dmg, targetDir) => {
  const volumes = await mount_dmg(dmg);
  const targetApp = joinPath(targetDir, 'factorio.app');
  try {
    for (const { path } of volumes) {
      const app = joinPath(path, 'factorio.app');
      const correct = await isDir(app);
      if (correct) {
        const files = await copy(app, targetApp, { dot: true, junk: true });
        console.log(`Copied ${files.length} files.`);
      }

      return targetApp;
    }

    throw new Error('No volume with factorio.app folder found.');
  } finally {
    await unmount_dmg(volumes);
  }
};

const unpack_win = async (zip, targetDir) => {
  await unzipTo(zip, targetDir);

  // Windows zips include folders with version names
  const folders = await readdir(targetDir);
  const folder = folders[0];

  if (!folder.startsWith('Factorio')) {
    throw new Error('Windows zip format changed. Report bug with Automata.');
  }

  const targetFactorioDir = joinPath(targetDir, 'factorio');
  await rename(joinPath(targetDir, folder), targetFactorioDir);
  return targetFactorioDir;
};

const not_impl = os => async (_archive, _targetDir) => {
  throw new Error(`Archive extracting for ${os} not yet implemented`);
};

export default (() => {
  switch (osName) {
    case 'osx': return unpack_osx;
    case 'win': return unpack_win;
    case 'linux': return not_impl('Linux');
  }
})();
