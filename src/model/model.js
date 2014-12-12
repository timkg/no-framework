var extend = require('extend');
var EventEmitter = require('../observable/eventEmitter');

function defineModel (modelName, repo, saveIn) {

  var ModelPrototype = {
    set: function (newAttrs) {
      this.attributes = extend(this.attributes, newAttrs);
      this.dirty = true;
      this.emit('change', newAttrs);
      return this;
    },
    get: function (attrName) {
      return this.attributes[attrName];
    },
    save: function () {
      this.dirty = false;
      repo.save(modelName, this);
      return this;
    },
    delete: function () {
      repo.delete(modelName, this.id);
      return this;
    }
  };

  var Model = function (options) {
    options = options || {};
    var model = Object.create(extend(ModelPrototype, new EventEmitter()));
    model.id = typeof options.id === 'number' ? options.id : null;
    model.attributes = {};
    if (options.attributes) {
      model.set(options.attributes);
    }
    return model;
  };

  Model.prototype = ModelPrototype;

  Model.find = function (id) {
    return repo.find(modelName, id);
  };

  if (repo && saveIn) {
    repo.register(modelName, Model, saveIn);
  }

  return Model;
}

module.exports = defineModel;
