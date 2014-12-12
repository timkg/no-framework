var Template = require('./template');
var StaticView = require('./staticView');
var bindViewToDom = require('./bindViewToDom');

function createModelView (options) {
  var ModelViewPrototype = Object.create(new StaticView());

  if (typeof options === 'string') {
    ModelViewPrototype.templates = new Template(options);
  } else if (typeof options.templates === 'object') {
    ModelViewPrototype.templates = new Template(options.templates);
  }

  if (typeof options.container === 'function') {
    ModelViewPrototype.container = options.container;
  }

  ModelViewPrototype.initEvents = function () {
    if (options.events) {
      var events = Object.keys(options.events);
      events.forEach(function (event) {
        var cb = options.events[event];
        this.container.addEventListener(event, cb.bind(this));
      }, this);
    }
  };

  var ModelView = function (model, container) {
    var modelView = Object.create(ModelViewPrototype);
    modelView.model = model;
    modelView.container = container || modelView.container();
    modelView.state = 'default';
    model.on('change', function () {
      modelView.render(modelView.model.attributes);
    });

    modelView.initEvents();
    modelView.render(modelView.model.attributes);

    bindViewToDom(modelView, modelView.container);

    return modelView;
  };

  return ModelView;
}

module.exports = createModelView;
