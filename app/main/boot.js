require('module-alias/register');
const { main } = require('../../aliases');

require('module-alias').addAliases(main);
require('./index');
