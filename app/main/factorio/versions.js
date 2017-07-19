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

const versionParseRegex = /^(\d+)\.(\d+)\.(\d+)( \(([a-z]+)\))$/;

export function* getGroupNames(version) {
  yield { name: 'Latest', slug: 'latest' };

  const match = versionParseRegex.exec(version);
  if (!match) throw new Error('Does not match regex');
  const major = match[1];
  const minor = match[2];
  // const patch = match[3];
  const type = match[5];

  yield { name: `Latest v${major}`, slug: `latest-${major}` };
  yield { name: `Latest v${major}.${minor}`, slug: `latest-${major}-${minor}` };

  if (type) {
    yield { name: `Latest ${type}`, slug: `latest-type-${type}` };
  }
}

export const compareVersions = (v1, v2) => {
  const m1 = versionParseRegex.exec(v1);
  const m2 = versionParseRegex.exec(v2);

  if (!m1) throw new Error(`Version ${v1} is not a valid version.`);
  if (!m2) throw new Error(`Version ${v2} is not a valid version.`);

  const [ _1, major1S, minor1S, patch1S ] = m1;
  const [ _2, major2S, minor2S, patch2S ] = m2;
  const major1 = parseInt(major1S, 10);
  const major2 = parseInt(major2S, 10);

  if (major1 > major2) return 1;
  if (major2 > major1) return -1;

  const minor1 = parseInt(minor1S, 10);
  const minor2 = parseInt(minor2S, 10);

  if (minor1 > minor2) return 1;
  if (minor2 > minor1) return -1;

  const patch1 = parseInt(patch1S, 10);
  const patch2 = parseInt(patch2S, 10);

  if (patch1 > patch2) return 1;
  if (patch2 > patch1) return -1;

  return 0;
};
