var defineModel = require('../src/model/model');
var Repository = require('../src/repository/repository');
var MemoryStore = require('../src/repository/memoryStore');
var assert = require('assert');

var memoryStore = new MemoryStore();
var repository = new Repository({
  memory: memoryStore
});

// function defineModel
// ModelDefinition
// modelInstance

var Model = defineModel('TestModel', repository, 'memory');

describe('model', function () {
  describe('defineModel', function () {
    it('defines a Model constructor function', function () {
      assert(typeof Model === 'function');
    });
  });

  describe('Model constructor ', function () {
    it('creates model instances', function () {
      var model = new Model();
      assert(typeof model === 'object');
    });

    it('finds model instances', function () {
      var m = new Model();
      m.save();
      var id = m.id;
      var foundModel = Model.find(id);
      assert(m.id === foundModel.id);
      memoryStore.deleteAll('TestModel');
    });
  });

  describe('model instance', function () {
    it('sets attributes', function () {
      var model = new Model();
      model.set({testAttr: 1});

      assert(model.attributes.testAttr === 1);
    });

    it('gets attributes', function () {
      var model = new Model();
      model.set({testAttr: 1});

      assert(model.get('testAttr') === 1);
    });

    it('saves itself', function () {
      var model = new Model();
      model.save();

      assert(memoryStore.models.TestModel[0] === model);
      memoryStore.deleteAll('TestModel');
    });

    it('deletes itself', function () {
      var model1 = new Model();
      var model2 = new Model();
      var model3 = new Model();
      model1.save();
      model2.save();
      model3.save();
      assert(memoryStore.models.TestModel[1] === model2);

      model1.delete();
      assert(memoryStore.models.TestModel[0] === null);
      assert(memoryStore.models.TestModel[1] === model2);
      assert(memoryStore.models.TestModel[2] === model3);
    });
  });
});


