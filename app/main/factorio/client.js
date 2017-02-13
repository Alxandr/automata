import fetch from 'node-fetch';
import { parse } from 'set-cookie-parser';

export class Client {
  constructor(host) {
    this.host = host;
    this.cookies = {};
  }

  async get(path) {
    const response = await fetch(`https://${this.host}/${path}`, {
      headers: {
        'cookie': this.createCookieString()
      }
    });

    this.updateCookies(response);
    return response;
  }

  createCookieString() {
    return Object.keys(this.cookies).map(name => {
      const value = this.cookies[name];
      return `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    }).join('; ');
  }

  updateCookies(response) {
    const newCookies = [].concat(...response.headers.getAll('cookie').map(parse));
    this.cookies = newCookies.reduce((cookies, newCookie) => ({ ...cookies, [newCookie.name]: newCookie.value }), this.cookies);
  }
}
