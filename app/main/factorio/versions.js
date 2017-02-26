import os from 'os';
import { Client } from './client';

const APP_OSNAME = Object.freeze({
  win: 'win64-manual',
  osx: 'osx',
  linux: 'linux64'
});

const osName = (() => {
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

const versionRegex = new RegExp(`^\/get-download\/(\d+\.\d+\.\d+)\/alpha\/${APP_OSNAME[osName]}$`, 'i');

const client = new Client('www.factorio.com');

export const getVersions = async () => {
  const response = await client.get('download');
  if (response.url.includes('login')) {
    return 'NEED_LOGIN';
  }

  throw new Error('TODO: implement');
};
