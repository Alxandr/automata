import fetch from 'node-fetch';
import { parse } from 'set-cookie-parser';

export const createCookieString = cookies =>
  Object.keys(cookies).map(name => {
    const value = cookies[name];
    return `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  }).join('; ');

const updateCookies = (session, response) => {
  const newCookies = [].concat(...response.headers.getAll('set-cookie').map(parse));
  return newCookies.reduce((cookies, newCookie) => ({ ...cookies, [newCookie.name]: newCookie.value }), session);
};

const send = async ({ session, url, ...opts }) => {
  if (session) {
    const cookieString = createCookieString(session);
    if (!opts.headers) {
      opts.headers = {};
    }

    opts.headers['cookie'] = cookieString;
  }

  const response = await fetch(url, opts);
  const newSession = updateCookies(session, response);
  response.session = newSession;
  return response;
};

export const get = (opts) => send({ ...opts, method: 'get' });
export const post = (opts) => send({ ...opts, method: 'post' });
