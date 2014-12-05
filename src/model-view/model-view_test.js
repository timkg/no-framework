var createModel = require('./createModel');
var createView = require('./createView');
var assert = require('assert');
var util = require('util');

describe('model-view', function () {
  it('renders the view with the model\'s data', function () {
    var m = createModel({
      amount: 1
    });
    var v = createView({
      model: m,
      template: '<span>amount: {{amount}}</span>'
    });

    assert(v.html === '<span>amount: 1</span>');
  });

  it('re-renders the view when the model changes', function () {
    var m = createModel({
      amount: 1
    });

    var v = createView({
      model: m,
      template: '<span>amount: {{amount}}</span>'
    });

    assert(v.html === '<span>amount: 1</span>');

    m.set({'amount': 2});

    assert(v.html === '<span>amount: 2</span>');
  });

  it('allows to attach multiple views to the same model', function () {
    var m = createModel({
      amount: 1
    });

    var v1 = createView({
      model: m,
      template: '<span>amount: {{amount}}</span>'
    });

    var v2 = createView({
      model: m,
      template: '<span>total: {{amount}}</span>'
    });

    assert(v1.html === '<span>amount: 1</span>');
    assert(v2.html === '<span>total: 1</span>');
  });

  it('re-renders multiple views attached to the same model', function () {
    var m = createModel({
      amount: 1
    });

    var v1 = createView({
      model: m,
      template: '<span>amount: {{amount}}</span>'
    });

    var v2 = createView({
      model: m,
      template: '<span>total: {{amount}}</span>'
    });

    assert(v1.html === '<span>amount: 1</span>');
    assert(v2.html === '<span>total: 1</span>');

    m.set({amount: 2});

    assert(v1.html === '<span>amount: 2</span>');
    assert(v2.html === '<span>total: 2</span>');
  });
});
