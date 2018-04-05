'use strict';

const execute = require('ott/src/execute');
const {
  n,
  view
} = require('kabanery');

/**
 * plain view
 */
const PlainView = view(({
  tagName,
  props,
  children
}) => {
  return n(tagName, props, children);
});

module.exports = (plain, {
  source = {},
  variableMap = {},
  xmlMap
} = {}) => {
  return execute(plain, {
    source,
    variableMap,

    xmlMap: Object.assign({
      createNode: (tagName, props, children) => {
        return PlainView({
          tagName,
          props,
          children
        });
      },

      updateNode: ([tagName, props, children], e) => {
        if (!e.stop) {
          e.stop = true;
          // update
          e.currentValue.ctx.update([
            ['tagName', tagName],
            ['props', props],
            ['children', children]
          ]);
        }

        return e.currentValue;
      }
    }, xmlMap)
  });
};
