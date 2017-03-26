import { get, post } from './api';

import FormData from 'form-data';

const url = 'https://www.factorio.com/login';
const regex = /<input (?:[^>]*)id="csrf_token"(?:[^>]*)value="([^"]+)"/i;

export default async function login(username, password) {
  const loginFormResponse = await get({ url });
  const { session } = loginFormResponse;
  const html = await loginFormResponse.text();

  const match = regex.exec(html);
  if (!match) {
    throw new Error('Login page is broken?');
  }

  const body = new FormData();
  body.append('username_or_email', username);
  body.append('password', password);
  body.append('csrf_token', match[1]);
  body.append('action', 'Login');

  const loginResponse = await post({ url, session, body, redirect: 'manual' });
  if (loginResponse.status === 302) {
    return loginResponse.session;
  }

  return null;
}
