'use strict';

const {
  parser,
  compile
} = require('./parser');
const execute = require('./execute');
const view = require('./view');

module.exports = {
  parser,
  compile,
  execute,
  view
};
