require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;
var undefined;

var isPlainObject = function isPlainObject(obj) {
	'use strict';
	if (!obj || toString.call(obj) !== '[object Object]') {
		return false;
	}

	var has_own_constructor = hasOwn.call(obj, 'constructor');
	var has_is_property_of_method = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !has_own_constructor && !has_is_property_of_method) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {}

	return key === undefined || hasOwn.call(obj, key);
};

module.exports = function extend() {
	'use strict';
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target === copy) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && Array.isArray(src) ? src : [];
					} else {
						clone = src && isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[name] = extend(deep, clone, copy);

				// Don't bring in undefined values
				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}],2:[function(require,module,exports){
var extend = require('extend');
var model = require('./model');
var createQueue = require('../queue/queue');
var observe = require('../observable/observe');

module.exports = function (opts) {
  var insert = opts.insert || function (models, model) {
    models.push(model);
  };

  var init = opts.init;

  var queue = createQueue();

  var c = {
    models: [],
    add: function (model) {
      insert(c.models, model);
      return model;
    },
    on: function (methodName, cb) {
      queue.add(function (resolve, reject) {
        observe(c, methodName, cb);
        resolve();
      })
    }
  };

  queue.add(init.bind(c));
  return c;
};

},{"../observable/observe":4,"../queue/queue":5,"./model":3,"extend":1}],3:[function(require,module,exports){
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

},{"extend":1}],4:[function(require,module,exports){
module.exports = function (obj, methodName, callback) {
  var originalMethod = obj[methodName];
  obj[methodName] = function () {
    var res = originalMethod.apply(obj, arguments);
    callback(res);
    return res;
  }
};
},{}],5:[function(require,module,exports){
function createQueue () {

  var isRunning = false;
  var queue = [];
  var pointer = 0;

  function next () {
    if (queue[pointer]) {
      queue[pointer]().then(function () {
        pointer += 1;
        next();
      })
    } else {
      isRunning = false;
    }
  }

  return {
    add: function (cb) {
      queue.push(function () {return new Promise(cb)});
      if (!isRunning) {
        isRunning = true;
        next();
      }
    }
  }
}

module.exports = createQueue;

},{}],6:[function(require,module,exports){
function createLocalStorageStore (modelType) {
  var localStorageStore = {
    save: function (model) {
      var models = JSON.parse(localStorage.getItem(model.type)) || [];
      if (!model.id) {
        model.attributes.id = models.length;
      }
      models.push(model);
      localStorage.setItem(model.type, JSON.stringify(models));
      return model;
    },
    find: function (modelName, id) {
      var models = JSON.parse(localStorage.getItem(modelName)) || [];
      return models.filter(function (model) {
        return model.attributes.id === id || model.id === id;
      })[0];
    },
    findAll: function (modelName) {
      return JSON.parse(localStorage.getItem(modelName)) || [];
    }
  };

  return localStorageStore;
}

module.exports = createLocalStorageStore;

},{}],7:[function(require,module,exports){
function createMemoryStore () {
  var memoryStore = {
    models: [],
    save: function (model) {
      if (!model.id) {
        model.id = memoryStore.models.length;
      }
      memoryStore.models.push(model);
      return model;
    },
    find: function (id) {
      return memoryStore.models[id];
    },
    findAll: function () {
      return memoryStore.models
    }
  };

  return memoryStore;
}

module.exports = createMemoryStore;

},{}],8:[function(require,module,exports){
function createRepo (storesMap) {
  var modelConstructorMap = {};
  var modelStoreMap = {};
  var repo = {
    register: function (type, constructorFn, saveIn) {
      modelConstructorMap[type] = constructorFn;
      modelStoreMap[type] = storesMap[saveIn];
    },
    save: function (model) {
      return modelStoreMap[model.type].save(model);
    },
    find: function (modelName, id) {
      var Model = modelConstructorMap[modelName];
      var modelStore = modelStoreMap[modelName];

      var modelAttributes = modelStore.find(modelName, id);
      return new Model(modelAttributes);
    },
    findAll: function (modelName) {
      var Model = modelConstructorMap[modelName];
      var modelStore = modelStoreMap[modelName];

      return modelStore
        .findAll(modelName)
        .map(function (modelData) {
          return new Model(modelData.attributes, modelData.id);
        });
    }
  };

  return repo;
}

module.exports = createRepo;

},{}],9:[function(require,module,exports){
module.exports = function (templateString) {
  return function (data) {
    this.html = templateString;
    for(var prop in data) {
      var regexString = '{{' + prop + '}}';
      this.html = this.html.replace(new RegExp(regexString, 'ig'), data[prop]);
    }

    return this.html;
  }
};

},{}],10:[function(require,module,exports){
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
      return v.html;
    }
  };

  v.collection.on('add', v.render);
  v.render();

  return v;
};

},{"../templating/templating":9}],11:[function(require,module,exports){
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

},{"../observable/observe":4,"../templating/templating":9}],"nf":[function(require,module,exports){
module.exports = {
  // constructors
  Model: require('./model/model'),
  Collection: require('./model/collection'),
  View: require('./view/view'),
  CollectionView: require('./view/collectionView'),
  template: require('./templating/templating'),
  observe: require('./observable/observe'),
  queue: require('./queue/queue'),
  // instances
  createRepository: require('./repository/repository'),
  stores: {
    memory: require('./repository/memoryStore'),
    localStorage: require('./repository/localStorageStore')
  }
};

},{"./model/collection":2,"./model/model":3,"./observable/observe":4,"./queue/queue":5,"./repository/localStorageStore":6,"./repository/memoryStore":7,"./repository/repository":8,"./templating/templating":9,"./view/collectionView":10,"./view/view":11}]},{},[]);
