var Template = require('./template');

function createStaticView (templateString) {
  var staticView = {
    templateString: templateString,
    render: function (data) {
      this.template = this.template || new Template(this.templateString);
      this.html = this.template(data);
      return this.html;
    }
  };

  return staticView;
}


module.exports = createStaticView;