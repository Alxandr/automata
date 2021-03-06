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

export const get = async (id) => {
  try {
    const result = await db.get(id);

    return result;
  } catch (e) {
    if (e.status === 404) return null;
    throw e;
  }
};

export const getAll = async (type) => {
  const result = await db.allDocs({
    include_docs: true,
    startkey: `${type}/`,
    endkey: `${type}/\uffff`,
  });

  return result.rows;
};

export const insert = async (id, doc) => {
  const result =  await db.put({
    ...doc,
    _id: id
  });

  return { id: result.id, rev: result.rev };
};

export const update = async doc => {
  const result = await db.put(doc);

  return { id: result.id, rev: result.rev };
};
