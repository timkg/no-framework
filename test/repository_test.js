var Repository = require('./../src/repository/repository');
var MemoryStore = require('./../src/repository/memoryStore');

var defineModel = require('../src/model/model');

var assert = require('assert');

var memoryStore = new MemoryStore();
var repository = new Repository({
  memory: memoryStore
});

var Post = defineModel('Post', repository, 'memory');

describe('repository', function () {
  it('registers a data store for a specific model type', function () {
    repository.register('something', function () {}, 'memory');
    assert(repository.modelStoreMap['something'] === memoryStore);
  });

  it('saves models', function () {
    var post = new Post({
      attributes: {
        published: true
      }
    });

    repository.save('Post', post);
    assert(repository.findAll('Post')[0].attributes.published === true);
    memoryStore.deleteAll('Post');
  });

  it('sets an id upon saving an item, starting at 0', function () {
    var post = new Post();
    repository.save('Post', post);

    assert(post.id === 0);
    memoryStore.deleteAll('Post');
  });

  it('increases item id by 1 for each saved item', function () {
    var post1 = new Post();
    var post2 = new Post();
    var post3 = new Post();
    repository.save('Post', post1);
    repository.save('Post', post2);
    repository.save('Post', post3);

    assert(post1.id === 0);
    assert(post3.id === 2);
    memoryStore.deleteAll('Post');
  });

  it('retrieves items by id', function () {
    var post = new Post();
    repository.save('Post', post);

    var newPost = repository.find('Post', 0);
    assert(post.id === newPost.id);
    memoryStore.deleteAll('Post');
  });

  it('retrieves all items', function () {
    var post1 = new Post();
    var post2 = new Post();
    var post3 = new Post();
    repository.save('Post', post1);
    repository.save('Post', post2);
    repository.save('Post', post3);

    var posts = repository.findAll('Post');
    assert(posts.length === 3);
    memoryStore.deleteAll('Post');
  });

});
