var extend = require('extend');
var EventEmitter = require('./../observable/eventEmitter');
var wrap = require('./../observable/wrapMethod');

function createRepo (storesMap) {
  var repo = extend({
    modelConstructorMap: {},
    modelStoreMap: {},
    register: function (modelName, constructorFn, saveIn) {
      repo.modelConstructorMap[modelName] = constructorFn;
      repo.modelStoreMap[modelName] = storesMap[saveIn];
    },
    save: function (modelName, model) {
      return repo.modelStoreMap[modelName].save(modelName, model);
    },
    find: function (modelName, id) {
      var Model = repo.modelConstructorMap[modelName];
      var modelStore = repo.modelStoreMap[modelName];

      var modelJson = modelStore.find(modelName, id);
      var m = new Model(modelJson);

      return m;
    },
    findAll: function (modelName) {
      var Model = repo.modelConstructorMap[modelName];
      var modelStore = repo.modelStoreMap[modelName];

      return modelStore
        .findAll(modelName)
        .map(function (modelData) {
          var m = new Model(modelData);
          return m;
        });
    },
    delete: function (modelName, modelId) {
      var modelStore = repo.modelStoreMap[modelName];
      return modelStore.delete(modelName, modelId);
    }
  }, new EventEmitter());

  return repo;
}

module.exports = createRepo;
