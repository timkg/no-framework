var Template = require('./template');
var StaticView = require('./staticView');
var extend = require('extend');
var wrap = require('./../observable/wrapMethod');

function createModelView (model, templateString) {
  var modelView = Object.create(new StaticView());
  modelView.model = model;
  modelView.templateString = templateString;
  if (typeof modelView.templateString === 'object') {
    modelView.state = 'start';
    modelView.render = function (data) {
      var render = Template(modelView.templateString[modelView.state]);
      modelView.html = render(data);
      return modelView.html;
    };
    modelView.stateTransition = function (newState) {
      modelView.state = newState;
      modelView.render(modelView.model.attributes);
    };
  }

  model.on('change', function () {
    modelView.render(modelView.model.attributes);
  });

  modelView.render(modelView.model.attributes);
  return modelView
}

module.exports = createModelView;
