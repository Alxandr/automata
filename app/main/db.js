import PouchDB from 'pouchdb';
import { getAppDir } from './app';

const db = (() => {
  const dbDir = getAppDir('db');
  const Db = PouchDB.defaults({
    prefix: dbDir + '/'
  });

  if (process.env.NODE_ENV === 'development') {
    const express = require('express');
    const pouch = require('express-pouchdb');
    const app = express();
    app.use(pouch(Db, {
      inMemoryConfig: true,
      mode: 'minimumForPouchDB',
      overrideMode: {
        include: [
          'routes/fauxton'
        ]
      }
    }));

    app.listen(8080, () => {
      console.log(`db path: ${dbDir}`); // eslint-disable-line no-console
      console.log('listening on 8080'); // eslint-disable-line no-console
    });
  }

  return new Db('automata');
})();

export const getAll = async (type) => {
  const result = await db.allDocs({
    include_docs: true,
    startkey: `${type}/`,
    endkey: `${type}/\uffff`,
  });

  return result.rows;
};
