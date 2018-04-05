'use strict';

const assert = require('assert');
const jsdom = require('jsdom');
const {
  view,
  compile
} = require('../..');
const {
  mount
} = require('kabanery');

describe('view', () => {
  it('base', (done) => {
    jsdom.env('<p></p>', (err, window) => {
      global.document = window.document;
      const plain = compile('<div>{.name}</div>');
      const {
        ottView
      } = view(plain)({
        name: '123'
      });
      mount(ottView, document.body);
      assert.equal(document.body.innerHTML, '<p></p><div>123</div>');
      done();
    });
  });

  it('simple update', (done) => {
    jsdom.env('<p></p>', (err, window) => {
      global.document = window.document;
      const plain = compile('<div>{.name}</div>');
      const {
        ottView,
        updateSource
      } = view(plain)({
        name: '123'
      });
      mount(ottView, document.body);

      updateSource(['name'], '456');

      assert.equal(document.body.innerHTML, '<p></p><div>456</div>');
      done();
    });
  });
});
