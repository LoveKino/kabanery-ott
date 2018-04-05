'use strict';

const {
  view
} = require('kabanery');

const execute = require('./execute');

/**
 *
 * @param ottPlain object
 * @return kabanery view
 */
module.exports = (ottPlain, options) => {
  const OttView = view((wrapper, ctx) => {
    const {
      value,
      updateSource
    } = execute(ottPlain, Object.assign({}, options, {
      source: wrapper.data,
      viewCtx: ctx
    }));

    wrapper.updateSource = updateSource;

    return value;
  });

  return (data) => {
    const wrapper = {
      data
    };
    const ottView = OttView(wrapper);

    return {
      ottView,
      updateSource: (...args) => {
        wrapper.updateSource && wrapper.updateSource(...args);
      }
    };
  };
};
