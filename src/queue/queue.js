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
