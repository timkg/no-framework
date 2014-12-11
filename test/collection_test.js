var defineCollection = require('../src/model/collection');
var defineModel = require('../src/model/model');
var Repository = require('../src/repository/repository');
var MemoryStore = require('../src/repository/memoryStore');
var assert = require('assert');

var memoryStore = new MemoryStore();
var repository = new Repository({
  memory: memoryStore
});

var TestModel = defineModel('TestModel', repository, 'memory');
var TestCollection = defineCollection(TestModel);

describe('collection', function () {
  describe('defineCollection', function () {
    it('creates Collection constructor', function () {
      assert(typeof TestCollection === 'function');
    });

  });

  describe('Collection constructor', function () {
    it('creates Collection instances', function () {
      var testCollection = new TestCollection();
      assert(typeof testCollection === 'object');
    });

  });

  describe('collection instance', function () {
    it('adds model instances', function () {
      var testCollection = new TestCollection();
      var testModel = new TestModel({attributes: {test: true}});
      testCollection.add(testModel);
      assert(testCollection.models[0].get('test'));
      memoryStore.deleteAll('TestModel');
    });

    it('adds raw model json', function () {
      var testCollection = new TestCollection();
      testCollection.add({test: true});
      assert(typeof testCollection.models[0] === 'object');
      memoryStore.deleteAll('TestModel');
    });

    it('emits change event when model is added', function (done) {
      var testCollection = new TestCollection();

      testCollection.on('change', function () {
        assert(typeof testCollection.models[0] === 'object');
        memoryStore.deleteAll('TestModel');
        done();
      });

      testCollection.add({test: true});
    });

    it('emits change event with newly added model', function (done) {
      var testCollection = new TestCollection();

      testCollection.on('change', function (model) {
        assert(model.get('test'));
        memoryStore.deleteAll('TestModel');
        done();
      });

      testCollection.add({test: true});
    });

    it('hasUnsavedModels() returns true if it has unsaved models with changes', function () {
      var testCollection = new TestCollection();
      testCollection.add({test: true});

      assert(testCollection.hasUnsavedModels());
    });

    it('hasUnsavedModels() returns false if it does not have unsaved models with changes', function () {
      var testCollection = new TestCollection();
      assert(!testCollection.hasUnsavedModels());
    });

    it('getUnsavedModels() returns models which have unsaved changes', function () {
      var testCollection = new TestCollection();
      var cleanModel = new TestModel();
      var dirtyModel = new TestModel({attributes: {test: true}});
      testCollection.add(cleanModel);
      testCollection.add(dirtyModel);

      var needSaving = testCollection.getUnsavedModels();
      assert(needSaving.length === 1);
      assert(needSaving[0] === dirtyModel);
    });
  });

});