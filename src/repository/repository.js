function createRepo (storesMap) {
  var modelConstructorMap = {};
  var modelStoreMap = {};
  var repo = {
    register: function (type, constructorFn, saveIn) {
      modelConstructorMap[type] = constructorFn;
      modelStoreMap[type] = storesMap[saveIn];
    },
    save: function (model) {
      return modelStoreMap[model.type].save(model);
    },
    find: function (modelName, id) {
      var Model = modelConstructorMap[modelName];
      var modelStore = modelStoreMap[modelName];

      var modelAttributes = modelStore.find(modelName, id);
      return new Model(modelAttributes);
    },
    findAll: function (modelName) {
      var Model = modelConstructorMap[modelName];
      var modelStore = modelStoreMap[modelName];

      return modelStore
        .findAll(modelName)
        .map(function (modelData) {
          return new Model(modelData.attributes, modelData.id);
        });
    }
  };

  return repo;
}

module.exports = createRepo;
