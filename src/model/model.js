var extend = require('extend');

function defineModel (modelName, repo, saveIn) {

  var ModelPrototype = {
    set: function (newAttrs) {
      this.attributes = extend(this.attributes, newAttrs);
    },
    get: function (attrName) {
      return this.attributes[attrName];
    },
    save: function () {
      repo.save(modelName, this);
    },
    delete: function () {
      repo.delete(modelName, this.id);
    }
  };

  var Model = function (options) {
    options = options || {};
    var model = Object.create(ModelPrototype);
    model.attributes = options.attributes || {};
    model.id = typeof options.id === 'number' ? options.id : null;

    return model;
  };

  Model.find = function (id) {
    return repo.find(modelName, id);
  };

  repo.register(modelName, Model, saveIn);
  return Model;
}

module.exports = defineModel;
