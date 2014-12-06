var observe = require('./../src/observable/observe');
var assert = require('assert');

describe('observe', function () {
  it('triggers callback when observed method is called', function (done) {
    var x = 1;
    var obj = {
      doSomething: function () {
        x = 2;
      }
    };

    observe(obj, 'doSomething', function () {
      assert(x === 2);
      done();
    });

    obj.doSomething();
  });

  it('keeps original return value of observed method intact', function () {
    var obj = {
      doSomething: function () {
        return 1;
      }
    };

    observe(obj, 'doSomething', function () {
    });

    var res = obj.doSomething();
    assert(res === 1);
  });

  it('calls callback with observed method\'s return value', function (done) {
    var obj = {
      doSomething: function () {
        return 1;
      }
    };

    observe(obj, 'doSomething', function (y) {
      assert(y === 1);
      done();
    });

    obj.doSomething();
  });

  it('allows to attach multiple callbacks', function (done) {
    var x = 1;
    var obj = {
      doSomething: function () {
        x = 2;
        return x;
      }
    };

    observe(obj, 'doSomething', function (y) {
      assert(y === 2);
      x = 3;
    });

    observe(obj, 'doSomething', function () {
      assert(x === 3);
      done();
    });

    obj.doSomething();
  });

  it('forwards parameters to the original method', function (done) {
    var x = 2;

    var obj = {
      multiply: function (n) {
        x = x * n;
        return x;
      }
    };

    observe(obj, 'multiply', function () {
      assert(x === 4);
      done();
    });

    obj.multiply(2);
  });
});
