function createRepo (storesMap) {
  var repo = {
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
      repo.getRelations(m, modelJson);

      return m;
    },
    findAll: function (modelName) {
      var Model = repo.modelConstructorMap[modelName];
      var modelStore = repo.modelStoreMap[modelName];

      return modelStore
        .findAll(modelName)
        .map(function (modelData) {
          var m = new Model(modelData);
          repo.getRelations(m, modelData);
          return m;
        });
    },
    getRelations: function (model, modelData) {
      if (modelData.relations) {
        for (var modelName in modelData.relations) {
          modelData.relations[modelName].forEach(function (modelJson) {
            var relative = repo.find(modelName, modelJson.attributes.id);
            model.addRelation(relative);
          })
        }
      }

      return model;
    },
    delete: function (modelName, modelId) {
      var modelStore = repo.modelStoreMap[modelName];
      return modelStore.delete(modelName, modelId);
    }
  };

  return repo;
}

module.exports = createRepo;
