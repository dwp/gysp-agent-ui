// eslint-disable-next-line import/no-extraneous-dependencies
const config = require('@dwp/eslint-config-base');

config.rules['max-len'] = ['error', { code: 200 }];
config.parserOptions = { ecmaVersion: 2018 };
module.exports = config;
