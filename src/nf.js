module.exports = {
  Model: require('./model/model'),
  Collection: require('./model/collection'),
  EventEmitter: require('./observable/eventEmitter'),
  Queue: require('./queue/queue'),
  Repository: require('./repository/repository'),
  MemoryStore: require('./repository/memoryStore'),
  LocalStorageStore: require('./repository/localStorageStore'),
  Template: require('./view/template'),
  StaticView: require('./view/staticView'),
  ModelView: require('./view/modelView'),
  CollectionView: require('./view/collectionView'),
  bindViewToDom: require('./view/bindViewToDom'),
  wrapMethod: require('./observable/wrapMethod')
};
