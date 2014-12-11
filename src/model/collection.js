var extend = require('extend');
var EventEmitter = require('../observable/eventEmitter');

function defineCollection (Model) {

  var CollectionPrototype = {
    add: function (model) {
      if (typeof model.id !== 'undefined' && typeof model.attributes !== 'undefined') {
        addModel.call(this, model);
      } else {
        addModelJson.call(this, model);
      }
    },
    hasUnsavedModels: function () {
      var dirtyModels = this.models.filter(function (model) {
        return model.dirty;
      });

      return !!dirtyModels.length;
    },
    getUnsavedModels: function () {
      return this.models.filter(function (model) {
        return model.dirty;
      });
    }
  };

  var addModelJson = function (json) {
    var model = new Model({attributes: json});
    addModel.call(this, model);
  };

  var addModel = function (model) {
    this.models.push(model);
    this.emit('change', model);
  };

  var Collection = function () {
    var collection = Object.create(extend(CollectionPrototype, new EventEmitter()));
    collection.models = [];
    return collection;
  };

  return Collection;
}

module.exports = defineCollection;
