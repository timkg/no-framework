var extend = require('extend');

function createModelDefinition (name, saveIn, repository) {
  var constructorFn = function (initialAttrs) {
    var m = {
      attributes: initialAttrs,
      name: name,
      relations: {},
      set: function (newAttrs) {
        m.attributes = extend(m.attributes, newAttrs);
      },
      addRelation: function (model) {
        m.relations[model.name] = m.relations[model.name] || [];
        m.relations[model.name].push(model);
        repository.save(m); // TODO - support batch operations
      }

    };
    return m;
  };

  saveIn = saveIn || 'memory';
  repository.register(name, constructorFn, saveIn);
  return constructorFn;
}

module.exports = createModelDefinition;
