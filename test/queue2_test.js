var Queue = require('../src/queue/queue');

var simpleThing = createThing({
  init: function (res, rej) {
    console.log('simpleThing init');
    res();
  },
  onReady: function () {
    console.log('simpleThing ready');
  }
});

var thing = createThing({
  load: function (res, rej) {
    console.log('thing loaded');
    res();
  },
  init: function (res, rej) {
    console.log('thing init');
    res();
  },
  start: function (res, rej) {
    console.log('thing started');
    res();
  },
  onReady: function () {
    console.log('thing ready');
  }
});

function createThing(thing) {
  var q = new Queue();
  if (thing.load) { q.add(thing.load); }
  if (thing.init) { q.add(thing.init); }
  if (thing.start) { q.add(thing.start); }
  q.on('end', thing.onReady);
  return q.start;
}

simpleThing();
thing();
