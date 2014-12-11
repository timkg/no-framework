var EventEmitter = function () {
  var eventEmitter = {
    listeners: {},
    on: function (eventName, cb) {
      eventEmitter.listeners[eventName] = eventEmitter.listeners[eventName] || [];
      eventEmitter.listeners[eventName].push(cb);
    },
    off: function (eventName, cb) {
      if (!eventEmitter.listeners[eventName]) { return; }
      var index = eventEmitter.listeners[eventName].indexOf(cb);
      eventEmitter.listeners[eventName].splice(index, 1);
    },
    emit: function (eventName) {
      if (!eventEmitter.listeners[eventName]) { return; }
      var args = Array.prototype.slice.call(arguments, 1);
      eventEmitter.listeners[eventName].forEach(function (cb) {
        cb.apply(this, args);
      }, this);
    }
  };

  return eventEmitter;
};

module.exports = EventEmitter;
