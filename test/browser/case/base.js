const {
  view,
  compile
} = require('../../..');
const {
  mount
} = require('kabanery');

const assert = require('assert');

const {
  ottView
} = view(compile('<div id="test">{.props.text}</div>'))({
  props: {
    text: 'txt'
  }
});

mount(ottView, document.body);

assert.equal(document.getElementById('test').innerHTML, 'txt');
