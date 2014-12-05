var EventEmitter = require('events').EventEmitter;
var extend = require('extend');

module.exports = function (data) {
  var m = {
    attributes: data,
    set: function (attrs) {
      m.attributes = extend(m.attributes, attrs);
      m.emit('change');
    }
  };

  return extend(m, EventEmitter.prototype);
};
