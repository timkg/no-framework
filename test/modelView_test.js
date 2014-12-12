var defineModelView = require('./../src/view/modelView');
var defineModel = require('./../src/model/model');
var assert = require('assert');

var Model = defineModel('TestModel');

describe('modelView', function () {
  describe('defineModelView', function () {
    it('creates ModelView constructor', function () {
      var templateString = '<div><h1>{{header}}</h1><p>{{text}}</p></div>';
      var ModelView = defineModelView(templateString);

      assert(typeof ModelView === 'function');
    });
  });

  describe('ModelView constructor', function () {
    it('creates modelView instances', function () {
      var templateString = '<div><h1>{{header}}</h1><p>{{text}}</p></div>';
      var ModelView = defineModelView(templateString);
      var model = new Model();
      var view = new ModelView(model, 'mockContainer');

      assert(typeof view === 'object');
    });
  });

  describe('modelView instance', function () {
    it('re-renders when its model changes', function () {
      var templateString = '<div><h1>{{header}}</h1><p>{{text}}</p></div>';
      var ModelView = defineModelView(templateString);
      var model = new Model();
      var view = new ModelView(model, 'mockContainer');

      view.render({
        header: 'Title',
        text: 'Copy'
      });
      assert(view.html === '<div><h1>Title</h1><p>Copy</p></div>');

      model.set({
        header: 'Title 2',
        text: 'Copy 2'
      });
      assert(view.html === '<div><h1>Title 2</h1><p>Copy 2</p></div>');
    });
  });
});
