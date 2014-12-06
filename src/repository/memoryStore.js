function createMemoryStore () {
  var memoryStore = {
    models: [],
    save: function (model) {
      if (!model.id) {
        model.id = memoryStore.models.length;
      }
      memoryStore.models.push(model);
      return model;
    },
    find: function (id) {
      return memoryStore.models[id];
    },
    findAll: function () {
      return memoryStore.models
    }
  };

  return memoryStore;
}

module.exports = createMemoryStore;
