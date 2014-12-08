var observe = require('../observable/observe');
var makeTemplate = require('../templating/templating');

module.exports = function (data) {
  var v = {
    templateString: data.template,
    model: data.model,
    render: function () {
      v.template = v.template || makeTemplate(v.templateString);
      v.html = v.template(v.model.attributes);
      return v.html;
    }
  };

  observe(v.model, 'set', v.render);
  v.render();

  return v;
};
