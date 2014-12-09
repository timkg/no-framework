function createLocalStorageStore (modelName) {
  var localStorageStore = {
    save: function (model) {
      var models = JSON.parse(localStorage.getItem(model.name)) || [];
      if (typeof model.attributes.id !== "number") {
        model.attributes.id = models.length;
      }
      models[model.attributes.id] = model;
      localStorage.setItem(model.name, JSON.stringify(models));
      return model;
    },
    find: function (modelName, id) {
      var models = JSON.parse(localStorage.getItem(modelName)) || [];
      return models.filter(function (model) {
        return model.attributes.id === id;
      })[0];
    },
    findAll: function (modelName) {
      return JSON.parse(localStorage.getItem(modelName)) || [];
    }
  };

  return localStorageStore;
}

module.exports = createLocalStorageStore;
