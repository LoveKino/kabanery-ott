'use strict';

const {
  view
} = require('kabanery');

const execute = require('./execute');

/**
 * @param ottPlain object
 * @return kabanery view
 *
 */
module.exports = (ottPlain, options) => {
  const OttView = view((data, ctx) => {
    const {
      value,
      updateSource
    } = execute(ottPlain, Object.assign({}, options, {
      source: data,
      viewCtx: ctx
    }));


    // TODO compose multiple updating
    data.update = (path, value) => {
      return updateSource(path.split('.'), value);
    };

    return value;
  });

  // TODO check data = {props, children}
  return ({
    props,
    children
  }) => {
    const data = {
      props,
      children
    };
    const ottView = OttView(data);

    return {
      ottView,
      update: (...args) => {
        data.update && data.update(...args);
      }
    };
  };
};
