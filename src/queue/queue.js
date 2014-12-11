var Promise = require('es6-promise').Promise;
var EventEmitter = require('../observable/eventEmitter');

function createQueue () {

  var started = false;
  var cbs = [];
  var pointer = 0;

  function next () {
    if (cbs[pointer]) {
      cbs[pointer]().then(
        function () {
          pointer += 1;
          next();
        },
        function (err) {
          queue.emit('error', err);
        }
      )
    } else {
      queue.emit('end');
    }
  }

  var queue = Object.create(new EventEmitter());

  queue.add = function (cb) {
    var step = function () {
      return new Promise(cb);
    };
    cbs.push(step);
    return step;
  };

  queue.start = function () {
    if (started) { return; }
    queue.emit('start');
    started = true;
    next();
  };

  return queue;
}

module.exports = createQueue;
