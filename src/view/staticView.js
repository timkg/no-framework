var Template = require('./template');

function createStaticView (templateString) {
  var staticView = {
    state: 'default',
    templates: new Template(templateString),
    render: function (data) {
      this.html = this.templates(this.state, data);
      return this.html;
    },
    stateTransition: function (newState) {
      this.state = newState;
      this.render(this.model.attributes);
    }
  };

  return staticView;
}

module.exports = createStaticView;
