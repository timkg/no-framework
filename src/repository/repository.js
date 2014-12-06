function createRepo () {
  var Repo = {
    repositories: {},
    register: function (type, repo) {
      this.repositories[type] = repo;
    },
    save: function (type, model) {
      return this.repositories[type].save(model);
    },
    find: function (type, id) {
      return this.repositories[type].find(id);
    },
    findAll: function (type) {
      return this.repositories[type].findAll();
    }
  };

  return Repo;
}

module.exports = createRepo;
