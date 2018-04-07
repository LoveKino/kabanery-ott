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
      const plain = compile('<div>{.props.name}</div>');
      const {
        ottView
      } = view(plain)({
        props: {
          name: '123'
        }
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
        update
      } = view(plain)({
        props: {
          name: '123'
        }
      });

      mount(ottView, document.body);
      update('props.name', '456');
      assert.equal(document.body.innerHTML, '<p></p><div>456</div>');
      done();
    });
  });

  it('update continuously', (done) => {
    jsdom.env('<p></p>', (err, window) => {
      global.document = window.document;
      const plain = compile('<div>{.props.name}</div>');
      const {
        ottView,
        update
      } = view(plain)({
        props: {
          name: '123'
        }
      });

      mount(ottView, document.body);
      update('props.name', '456');
      assert.equal(document.body.innerHTML, '<p></p><div>456</div>');

      update('props.name', '789');
      assert.equal(document.body.innerHTML, '<p></p><div>789</div>');
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

  it('update sub view in composer', (done) => {
    jsdom.env('<p></p>', (err, window) => {
      global.document = window.document;
      const {
        ottView,
        update
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

      update('props.title', 'newTest');

      assert.equal(document.body.innerHTML, '<p></p><div id="123"><span>newTest</span></div>');
      done();
    });
  });

  it('list view', (done) => {
    jsdom.env('<p></p>', (err, window) => {
      global.document = window.document;
      const {
        ottView
      } = view(compile('<ul>{map(.props.list, (item) -> <li>{item}</li>)}</ul>'), {
        variableMap: {
          map: (list, handler) => list.map(handler)
        }
      })({
        props: {
          list: [1, 2, 3]
        }
      });

      mount(ottView, document.body);

      assert.equal(document.body.innerHTML, '<p></p><ul><li>1</li><li>2</li><li>3</li></ul>');

      done();
    });
  });

  it('list view update item', (done) => {
    jsdom.env('<p></p>', (err, window) => {
      global.document = window.document;
      const {
        ottView,
        update
      } = view(compile('<ul>{map(.props.list, (item) -> <li>{item}</li>)}</ul>'), {
        variableMap: {
          map: (list, handler) => list.map(handler)
        }
      })({
        props: {
          list: [1, 2, 3]
        }
      });

      mount(ottView, document.body);

      update('props.list.0', 6);

      assert.equal(document.body.innerHTML, '<p></p><ul><li>6</li><li>2</li><li>3</li></ul>');

      done();
    });
  });

  it('list view update item2', (done) => {
    jsdom.env('<p></p>', (err, window) => {
      global.document = window.document;
      const {
        ottView,
        update
      } = view(compile('<ul>{map(.props.list, (item, index) -> <li>{.props.list.[index]}</li>)}</ul>'), {
        variableMap: {
          map: (list, handler) => list.map(handler)
        }
      })({
        props: {
          list: [1, 2, 3]
        }
      });

      mount(ottView, document.body);

      update('props.list.0', 6);

      assert.equal(document.body.innerHTML, '<p></p><ul><li>6</li><li>2</li><li>3</li></ul>');

      done();
    });
  });

});
