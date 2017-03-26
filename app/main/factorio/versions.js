import { SAXParser } from 'parse5';
import { get } from './api';
import { osName } from '../app';

const url = 'https://www.factorio.com/download';

const APP_OSNAME = Object.freeze({
  win: 'win64-manual',
  osx: 'osx',
  linux: 'linux64'
});

const versionRegex = new RegExp(`^\\/get-download\\/(\\d+\\.\\d+\\.\\d+)\\/alpha\\/${APP_OSNAME[osName]}$`, 'i');
const parseVersions = (response) => new Promise((resolve) => {
  console.log('Regex: ', versionRegex);
  const versions = [];
  const parser = new SAXParser();
  parser.on('startTag', (name, attrs) => {
    if (name.toLowerCase() === 'a') {
      const href = attrs.find(attr => attr.name.toLowerCase() === 'href') || null;
      if (href === null) {
        return;
      }

      const match = versionRegex.exec(href.value.trim());
      if (match) {
        const version = {
          name: `${match[1]} (alpha)`,
          url: href.value.trim()
        };
        versions.push(version);
      }
    }
  });

  parser.on('finish', () => {
    resolve(versions);
  });

  response.body.pipe(parser);
});

export const getVersions = async (session) => {
  const response = await get({ session, url, redirect: 'manual' });
  if (response.status === 302) {
    return 'NEED_LOGIN';
  }

  const versions = await parseVersions(response);
  return versions;
};
