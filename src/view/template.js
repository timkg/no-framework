function createTemplate (templateString) {
  return function (data) {
    var html = templateString;
    for(var prop in data) {
      var regexString = '{{' + prop + '}}';
      html = html.replace(new RegExp(regexString, 'ig'), data[prop]);
    }

    return html;
  }
}

module.exports = createTemplate;
