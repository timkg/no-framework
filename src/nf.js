module.exports = {
  // constructors
  Model: require('./model/model'),
  Collection: require('./model/collection'),
  View: require('./view/view'),
  CollectionView: require('./view/collectionView'),
  template: require('./templating/templating'),
  observe: require('./observable/observe'),
  queue: require('./queue/queue'),
  // instances
  createRepository: require('./repository/repository'),
  stores: {
    memory: require('./repository/memoryStore'),
    localStorage: require('./repository/localStorageStore')
  }
};
