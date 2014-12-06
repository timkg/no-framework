var createRepo = require('./repository');
var createMemoryStore = require('./memoryStore');
var assert = require('assert');

var POSTS = 'Posts';
var USERS = 'Users';

describe('repository', function () {
  it('registers a data store for a specific item type', function () {
    var Repo = createRepo();
    Repo.register(POSTS, createMemoryStore());
    assert(Repo.repositories[POSTS]);
  });

  it('saves items', function () {
    var Repo = createRepo();
    Repo.register(POSTS, createMemoryStore());

    var post = {published: true};
    Repo.save(POSTS, post);

    assert(Repo.findAll(POSTS)[0].published === true);
  });

  it('sets an id upon saving an item, starting at 0', function () {
    var Repo = createRepo();
    Repo.register(POSTS, createMemoryStore());

    var post = Repo.save(POSTS, {published: true});

    assert(post.id === 0);
  });

  it('increases item id by 1 for each saved item', function () {
    var Repo = createRepo();
    Repo.register(POSTS, createMemoryStore());

    var post0 = Repo.save(POSTS, {published: true});
    var post1 = Repo.save(POSTS, {published: true});
    var post2 = Repo.save(POSTS, {published: true});
    var post3 = Repo.save(POSTS, {published: true});

    assert(post3.id === 3);
  });

  it('retrieves items by id', function () {
    var Repo = createRepo();
    Repo.register(POSTS, createMemoryStore());

    var post = Repo.save(POSTS, {published: true});
    var samePost = Repo.find(POSTS, 0);
    assert(post.id === samePost.id);
  });

  it('retrieves all items', function () {
    var Repo = createRepo();
    Repo.register(POSTS, createMemoryStore());

    Repo.save(POSTS, {published: 'true'});
    Repo.save(POSTS, {published: 'false'});
    Repo.save(POSTS, {published: 'maybe'});

    var posts = Repo.findAll(POSTS);
    assert(posts.length === 3);
    assert(posts[1].published === 'false');
  });

  it('registers multiple data stores for different item types', function () {
    var Repo = createRepo();
    Repo.register(POSTS, createMemoryStore());
    Repo.register(USERS, createMemoryStore());

    assert(Repo.repositories[POSTS]);
    assert(Repo.repositories[USERS]);
  });

  it('saves items to correct data store', function () {
    var Repo = createRepo();
    Repo.register(POSTS, createMemoryStore());
    Repo.register(USERS, createMemoryStore());

    var post = {published: true};
    Repo.save(POSTS, post);

    var user = {isAuthor: true};
    Repo.save(USERS, user);

    var allPosts = Repo.findAll(POSTS);
    var allUsers = Repo.findAll(USERS);

    assert(allPosts[0].published === true);
    assert(typeof allPosts[1] === "undefined");
    assert(allUsers[0].isAuthor === true);
    assert(typeof allUsers[1] === "undefined");
  });

});




