module.exports = function (templateString) {
  return function (data) {
    this.html = templateString;
    for(var prop in data) {
      var regexString = '{{' + prop + '}}';
      this.html = this.html.replace(new RegExp(regexString, 'ig'), data[prop]);
    }

    return this.html;
  }
};
