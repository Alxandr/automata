const path = require('path');

const shared = {
  '@shared': path.join(__dirname, 'app', 'shared')
};

const main = Object.assign({}, shared, {
  '@windowid': path.join(__dirname, 'app', 'main', 'windowid')
});

const renderer = Object.assign({}, shared, {
  '@renderer': path.join(__dirname, 'app', 'renderer'),
  '@windowid': path.join(__dirname, 'app', 'renderer', 'windowid'),
  '@styles': path.join(__dirname, 'app', 'renderer', 'styles'),
  '@i18n': path.join(__dirname, 'app', 'renderer', 'i18n'),
  '@components': path.join(__dirname, 'app', 'renderer', 'components')
});

Object.assign(module.exports, {
  main,
  renderer
});
