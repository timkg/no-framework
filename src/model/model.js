var extend = require('extend');

function createModelDefinition (name, saveIn, repository) {
  var constructorFn = function (initialAttrs, id) {
    var m = {
      attributes: initialAttrs,
      name: name,
      id: id,
      set: function (newAttrs) {
        m.attributes = extend(m.attributes, newAttrs);
      }
    };
    return m;
  };

  saveIn = saveIn || 'memory';
  repository.register(name, constructorFn, saveIn);
  return constructorFn;
}

module.exports = createModelDefinition;
