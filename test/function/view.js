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
      const plain = compile('<div>{.props.name}</div>');
      const {
        ottView,
        updateSource
      } = view(plain)({
        props: {
          name: '123'
        }
      });

      mount(ottView, document.body);
      updateSource(['props', 'name'], '456');
      assert.equal(document.body.innerHTML, '<p></p><div>456</div>');
      done();
    });
  });

  it('compose ott view', (done) => {
    jsdom.env('<p></p>', (err, window) => {
      global.document = window.document;
      const {
        ottView
      } = view(compile('<div id=.props.id><Text text=.props.title></Text></div>'), {
        viewMap: {
          Text: view(compile('<span>{.props.text}</span>'))
        }
      })({
        props: {
          id: 123,
          title: 'test'
        }
      });

      mount(ottView, document.body);

      assert.equal(document.body.innerHTML, '<p></p><div id="123"><span>test</span></div>');
      done();
    });
  });
});
