function createMemoryStore () {
  var memoryStore = {
    models: {},
    save: function (modelName, model) {
      memoryStore.models[modelName] = memoryStore.models[modelName] || [];
      model.id = memoryStore.models[modelName].length;
      memoryStore.models[modelName].push(model);
      return model;
    },
    find: function (modelName, id) {
      memoryStore.models[modelName] = memoryStore.models[modelName] || [];
      return memoryStore.models[modelName][id];
    },
    findAll: function (modelName) {
      memoryStore.models[modelName] = memoryStore.models[modelName] || [];
      return memoryStore.models[modelName].filter(function (m) { return m; });
    },
    delete: function (modelName, id) {
      memoryStore.models[modelName] = memoryStore.models[modelName] || [];
      memoryStore.models[modelName][id] = null;
    },
    deleteAll: function (modelName) {
      if (!modelName) { return; }
      memoryStore.models[modelName] = [];
    }
  };

  return memoryStore;
}

module.exports = createMemoryStore;
