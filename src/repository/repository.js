function createRepo (storesMap) {
  var modelConstructorMap = {};
  var modelStoreMap = {};
  var repo = {
    register: function (modelName, constructorFn, saveIn) {
      modelConstructorMap[modelName] = constructorFn;
      modelStoreMap[modelName] = storesMap[saveIn];
    },
    save: function (model) {
      return modelStoreMap[model.name].save(model);
    },
    find: function (modelName, id) {
      var Model = modelConstructorMap[modelName];
      var modelStore = modelStoreMap[modelName];

      var modelJson = modelStore.find(modelName, id);
      var m = new Model(modelJson.attributes, modelJson.id);
      repo.getRelations(m, modelJson);

      return m;
    },
    findAll: function (modelName) {
      var Model = modelConstructorMap[modelName];
      var modelStore = modelStoreMap[modelName];

      return modelStore
        .findAll(modelName)
        .map(function (modelData) {
          var m = new Model(modelData.attributes, modelData.attributes.id);
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
    }
  };

  return repo;
}

module.exports = createRepo;
