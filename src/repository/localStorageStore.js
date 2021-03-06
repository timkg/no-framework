function get (modelName) {
  return JSON.parse(window.localStorage.getItem(modelName)) || [];
}

function set (modelName, models) {
  window.localStorage.setItem(modelName, JSON.stringify(models));
}

function createLocalStorageStore () {
  var localStorageStore = {
    save: function (modelName, model) {
      var models = get(modelName);
      model.id = (typeof model.id === 'number' ? model.id : models.length);
      models[model.id] = model;
      set(modelName, models);
      return model;
    },
    find: function (modelName, id) {
      var models = get(modelName);
      return models[id];
    },
    findAll: function (modelName) {
      var models = get(modelName);
      return models.filter(function (m) { return m; });
    },
    delete: function (modelName, id) {
      var models = get(modelName);
      models[id] = null;
    },
    deleteAll: function (modelName) {
      if (!modelName) { return; }
      set(modelName, []);
    }
  };

  return localStorageStore;
}

module.exports = createLocalStorageStore;
