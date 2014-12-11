var makeTemplate = require('../templating/templating');

module.exports = function (data) {
  var v = {
    templateString: data.template,
    collection: data.collection,
    container: data.container,
    render: function () {
      v.template = v.template || makeTemplate(v.templateString);
      v.html = v.collection.models
        .map(function (model) {
          return v.template(model.attributes);
        })
        .join('');
      v.container.innerHTML = v.html;

      v.container.addEventListener('click', function (event) {
        switch (event.target.dataset.action) {
          case 'delete':
            var modelId = event.target.dataset.modelId;
            debugger
            break;
        }
      });

      return v.html;
    }
  };

  v.collection.on('add', v.render);
  v.render();

  return v;
};
