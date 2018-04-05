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
  viewMap = {},
  xmlMap
} = {}) => {
  return execute(plain, {
    source,
    variableMap,

    xmlMap: Object.assign({
      createNode: (tagName, props, children) => {
        if (viewMap[tagName]) {
          return viewMap[tagName]({
            props,
            children
          }).ottView;
        }
        return PlainView({
          tagName,
          props,
          children
        });
      },

      updateNode: ([, props, children], e) => {
        if (!e.stop) {
          e.stop = true;
          // update
          e.currentValue.ctx.update([
            ['props', props],
            ['children', children]
          ]);
        }

        return e.currentValue;
      }
    }, xmlMap || {})
  });
};
