var Template = require('./template');
var StaticView = require('./staticView');
var extend = require('extend');

function createModelView (model, templateString) {
  var modelView = {
    templateString: templateString,
    model: model
  };

  model.on('change', function () {
    modelView.render(modelView.model.attributes);
  });

  return extend(modelView, Object.create(new StaticView()));
}

module.exports = createModelView;
