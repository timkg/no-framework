var Queue = require('../src/queue/queue');
var Promise = require('es6-promise').Promise;
var assert = require('assert');

describe('queue', function () {

  describe('Queue constructor', function () {
    it('creates queue instances', function () {
      var queue = new Queue();
      assert(typeof queue === 'object');
    })
  });

  describe('queue instance', function () {
    it('adds methods via add', function () {
      var queue = new Queue();
      var step = queue.add(function () {});
      assert(typeof step === 'function');
    });

    it('emits start event on start', function (done) {
      var queue = new Queue();
      queue.on('start', function () {
        assert(true);
        done();
      });

      queue.start();
    });

    it('emits end event on end', function (done) {
      var queue = new Queue();
      queue.add(function (resolve, reject) {
        resolve();
      });
      queue.add(function (resolve, reject) {
        resolve();
      });

      queue.on('end', function () {
        assert(true);
        done();
      });

      queue.start();
    });

    it('calls steps in sequence', function (done) {
      var str = '';

      var queue = new Queue();
      queue.add(function (resolve, reject) {
        setTimeout(function () {
          str += 'a';
          resolve();
        }, 10);
      });
      queue.add(function (resolve, reject) {
        str += 'b';
        resolve();
      });

      queue.on('end', function () {
        assert(str === 'ab');
        done();
      });

      queue.start();
    });

    it('emits error event when a step fails', function (done) {
      var queue = new Queue();
      queue.add(function (resolve, reject) {
        setTimeout(function () {
          resolve();
        }, 10);
      });
      queue.add(function (resolve, reject) {
        reject('error');
      });

      queue.on('error', function (error) {
        assert(error === 'error');
        done();
      });

      queue.start();
    });

  });

});
