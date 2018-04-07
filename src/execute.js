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
  xmlMap,
  signals
} = {}) => {
  return execute(plain, {
    source,
    variableMap,

    xmlMap: Object.assign({
      createNode: (tagName, props, children) => {
        const nodeData = {
          tagName,
          props: parseSignal(props, signals),
          children
        };

        if (viewMap[tagName]) {
          return viewMap[tagName](nodeData).ottView;
        }
        return PlainView(nodeData);
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

const parseSignal = (oriProps, signals) => {
  const props = Object.assign({}, oriProps);
  if (props.signal) {
    const [fromSignal, toSignal, ...args] = props.signal;
    props[`on${fromSignal}`] = (e) => {
      signals[toSignal] && signals[toSignal](...args, e);
    };
  }
  return props;
};
