var extend = require('extend');
var wrap = require('../observable/wrapMethod');

function app () {
  var nf = this;
  var app = Object.create(extend(nf, new nf.EventEmitter()));

  app.repo = nf.Repository({
    memory: nf.MemoryStore(),
    localStorage: nf.LocalStorageStore()
  });

  app.Model = function (modelName, persistence) {
    persistence = persistence || 'memory';
    return nf.Model(modelName, app.repo, persistence);
  };

  wrap(app.repo, 'register', function (modelName, constructorFn, persistence) {
    wrap(constructorFn.prototype, 'set', function (model) {
      app.emit('model:changed', model);
    });
    wrap(constructorFn.prototype, 'save', function (model) {
      app.emit('model:saved', model);
    });
    wrap(constructorFn.prototype, 'delete', function (model) {
      app.emit('model:deleted', model);
    });
  });

  return app;
}

module.exports = app;
