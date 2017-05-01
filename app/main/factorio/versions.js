import { SAXParser } from 'parse5';
import { get } from './api';
import { osName } from '../app';

const stableUrl = 'https://www.factorio.com/download/stable';
const experimentalUrl = 'https://www.factorio.com/download/experimental';

const APP_OSNAME = Object.freeze({
  win: 'win64-manual',
  osx: 'osx',
  linux: 'linux64'
});

const versionRegex = new RegExp(`^\\/get-download\\/(\\d+\\.\\d+\\.\\d+)\\/alpha\\/${APP_OSNAME[osName]}$`, 'i');
const parseVersions = (response) => new Promise((resolve) => {
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

const getVersionsFromUrl = async (session, url, experimental) => {
  const response = await get({ session, url, redirect: 'manual' });
  if (response.status === 302) {
    return 'NEED_LOGIN';
  }

  const versions = await parseVersions(response);
  return versions.map(v => ({ ...v, experimental }));
};

export const getVersions = async (session) => {
  const [ stable, experimental ] = await Promise.all([
    getVersionsFromUrl(session, stableUrl, false),
    getVersionsFromUrl(session, experimentalUrl, true)
  ]);

  if (stable === 'NEED_LOGIN' || experimental === 'NEED_LOGIN') {
    return 'NEED_LOGIN';
  }

  return experimental.concat(stable);
};
