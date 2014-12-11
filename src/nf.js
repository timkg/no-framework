module.exports = {
  Model: require('./model/model'),
  Collection: require('./model/collection'),
  Template: require('./templating/templating'),
  EventEmitter: require('./observable/eventEmitter'),
  Queue: require('./queue/queue'),
  Repository: require('./repository/repository'),
  MemoryStore: require('./repository/memoryStore'),
  LocalStorageStore: require('./repository/localStorageStore'),
  wrapMethod: require('./observable/wrapMethod')
};
