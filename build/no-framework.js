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

module.exports = function (data) {
  var m = {
    attributes: data,
    set: function (attrs) {
      m.attributes = extend(m.attributes, attrs);
    }
  };

  return m;
};

},{"extend":1}],3:[function(require,module,exports){
var observe = require('../observable/observe');
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

  observe(v.model, 'set', v.render);
  v.render();

  return v;
};

},{"../observable/observe":4,"../templating/templating":7,"extend":1}],4:[function(require,module,exports){
module.exports = function (obj, methodName, callback) {
  var originalMethod = obj[methodName];
  obj[methodName] = function () {
    var res = originalMethod.apply(obj, arguments);
    callback(res);
    return res;
  }
};
},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
function createRepo () {
  var Repo = {
    repositories: {},
    register: function (type, repo) {
      this.repositories[type] = repo;
    },
    save: function (type, model) {
      return this.repositories[type].save(model);
    },
    find: function (type, id) {
      return this.repositories[type].find(id);
    },
    findAll: function (type) {
      return this.repositories[type].findAll();
    }
  };

  return Repo;
}

module.exports = createRepo;

},{}],7:[function(require,module,exports){
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

},{}],"nf":[function(require,module,exports){
module.exports = {
  model: require('./model-view/createModel'),
  view: require('./model-view/createView'),
  template: require('./templating/templating'),
  observe: require('./observable/observe'),
  memoryStore: require('./repository/memoryStore'),
  repository: require('./repository/repository')
};

},{"./model-view/createModel":2,"./model-view/createView":3,"./observable/observe":4,"./repository/memoryStore":5,"./repository/repository":6,"./templating/templating":7}]},{},[]);
