function createLocalStorageStore (modelType) {
  var localStorageStore = {
    save: function (model) {
      var models = JSON.parse(localStorage.getItem(model.type)) || [];
      if (!model.id) {
        model.attributes.id = models.length;
      }
      models.push(model);
      localStorage.setItem(model.type, JSON.stringify(models));
      return model;
    },
    find: function (modelName, id) {
      var models = JSON.parse(localStorage.getItem(modelName)) || [];
      return models.filter(function (model) {
        return model.attributes.id === id || model.id === id;
      })[0];
    },
    findAll: function (modelName) {
      return JSON.parse(localStorage.getItem(modelName)) || [];
    }
  };

  return localStorageStore;
}

module.exports = createLocalStorageStore;
