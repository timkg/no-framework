var Template = require('./template');
var StaticView = require('./staticView');
var extend = require('extend');
var wrap = require('./../observable/wrapMethod');
var bindViewToDom = require('./bindViewToDom');

function createModelView (model, options) {
  var modelView = Object.create(new StaticView());
  modelView.model = model;

  model.on('change', function () {
    modelView.render(modelView.model.attributes);
  });

  if (typeof options === 'string') {
    modelView.templateString = options;
  }

  if (options.render) {
    switch (typeof options.render) {
      case 'string':
        modelView.templateString = options.render;
        break;
      case 'object':
        // options.render is a state:templateString map
        modelView.templateStrings = options.render;
        modelView.render = function (data) {
          var render = Template(modelView.templateStrings[modelView.state]);
          modelView.html = render(data);
          return modelView.html;
        };
        // default start state
        modelView.state = 'default';
        // we need to support state transitions
        modelView.stateTransition = function (newState) {
          modelView.state = newState;
          modelView.render(modelView.model.attributes);
        };
        break;
      default:
        throw new Error('View requires a template string! Received ' + options.render);
    }
  }

  modelView.render(modelView.model.attributes);

  if (options.container) {
    modelView.container = (typeof options.container === 'function' ? options.container() : options.container);
    bindViewToDom(modelView, modelView.container);
  }

  if (options.events) {
    var events = Object.keys(options.events);
    events.forEach(function (event) {
      var cb = options.events[event];
      modelView.container.addEventListener(event, cb);
    })
  }

  return modelView
}

module.exports = createModelView;
