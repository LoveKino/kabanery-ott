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

describe('signal', () => {
  it('original', (done) => {
    jsdom.env('<p></p>', (err, window) => {
      global.document = window.document;
      const plain = compile('<div id="test" onclick=.props.handler>{.props.name}</div>');
      const {
        ottView,
        update
      } = view(plain)({
        props: {
          name: '123',
          handler: () => {
            update('props.name', '456');
          }
        }
      });

      mount(ottView, document.body);

      document.getElementById('test').click();
      assert.equal(document.body.innerHTML, '<p></p><div id="test">456</div>');
      done();
    });
  });

  it('signal export', (done) => {
    jsdom.env('<p></p>', (err, window) => {
      global.document = window.document;
      const plain = compile('<div id="test" signal=["click", "changeName"]>{.props.name}</div>');
      const {
        ottView,
        update
      } = view(plain, {
        signals: {
          changeName: () => {
            update('props.name', '456');
          }
        }
      })({
        props: {
          name: '123'
        }
      });

      mount(ottView, document.body);

      document.getElementById('test').click();

      assert.equal(document.getElementById('test').textContent, '456');
      done();
    });
  });
});
