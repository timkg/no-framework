var wrap = require('./../src/observable/wrapMethod');
var EventEmitter = require('./../src/observable/eventEmitter');
var assert = require('assert');

describe('observe', function () {

  describe('EventEmitter', function () {
    describe('EventEmitter constructor', function () {
      it('returns a new eventEmitter', function () {
        var ee = new EventEmitter();
        assert(ee.on);
        assert(ee.off);
        assert(ee.emit);
      });
    });

    describe('eventEmitter instance', function () {
      it('registers listeners via on', function () {
        var ee = new EventEmitter();
        var cb = function () {};
        var cb2 = function () {};
        ee.on('test', cb);
        ee.on('test', cb2);
        assert(ee.listeners.test[0] === cb);
        assert(ee.listeners.test[1] === cb2);
      });

      it('triggers listeners via emit', function () {
        var cbCount = 0;
        var ee = new EventEmitter();
        var cb = function () { cbCount++; };
        var cb2 = function () { cbCount++; };
        ee.on('test', cb);
        ee.on('test', cb2);

        ee.emit('test');

        assert(cbCount === 2);
      });

      it('passes arguments to listeners', function (done) {
        var ee = new EventEmitter();
        var cb = function (arg1, arg2) {
          assert(arg1 === 1);
          assert(arg2 === 2);
          done();
        };
        ee.on('test', cb);

        ee.emit('test', 1, 2);
      });

      it('removes listeners via off', function () {
        var ee = new EventEmitter();
        var cb1 = function () {};
        var cb2 = function () {};
        var cb3 = function () {};

        ee.on('test', cb1);
        ee.on('test', cb2);
        ee.on('test', cb3);

        ee.off('test', cb2);

        assert(ee.listeners.test.length === 2);
        assert(ee.listeners.test[0] === cb1);
        assert(ee.listeners.test[1] === cb3);
      });
    });
  });

  describe('wrapMethod', function () {
    it('triggers callback when observed method is called', function (done) {
      var x = 1;
      var obj = {
        doSomething: function () {
          x = 2;
        }
      };

      wrap(obj, 'doSomething', function () {
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

      wrap(obj, 'doSomething', function () {
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

      wrap(obj, 'doSomething', function (y) {
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

      wrap(obj, 'doSomething', function (y) {
        assert(y === 2);
        x = 3;
      });

      wrap(obj, 'doSomething', function () {
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

      wrap(obj, 'multiply', function () {
        assert(x === 4);
        done();
      });

      obj.multiply(2);
    });
  });

});

