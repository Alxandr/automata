import { addAliases } from 'module-alias';

//const rel = path => `${__dirname}/${path}`;

addAliases({
  '@renderer': __dirname,
  '@windowid': __dirname + '/windowid',
  '@styles': __dirname + '/styles',
  '@i18n': __dirname + '/i18n',
  '@components': __dirname + '/components'
});
