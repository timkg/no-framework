var EventEmitter = require('events').EventEmitter;
var makeTemplate = require('../templating/templating');
var extend = require('extend');

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

  v.model.on('change', v.render);
  v.render();

  return extend(v, EventEmitter.prototype);
};
