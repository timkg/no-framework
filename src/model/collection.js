var extend = require('extend');
var model = require('./model');
var createQueue = require('../queue/queue');
var observe = require('../observable/observe');

module.exports = function (opts) {
  var insert = opts.insert || function (models, model) {
    models.push(model);
  };

  var init = opts.init;

  var queue = createQueue();

  var c = {
    models: [],
    add: function (model) {
      insert(c.models, model);
      return model;
    },
    on: function (methodName, cb) {
      queue.add(function (resolve, reject) {
        observe(c, methodName, cb);
        resolve();
      })
    }
  };

  queue.add(init.bind(c));
  return c;
};
