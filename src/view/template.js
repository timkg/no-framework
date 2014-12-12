function createTemplate (templateString) {
  var templates = {};
  if (typeof templateString === 'string') {
    templates.default = templateString;
  } else if (typeof templates === 'object') {
    templates = templateString;
  }
  return function (state, data) {
    if (!data) {
      data = state;
      state = 'default';
    }
    var html = templates[state];
    for(var prop in data) {
      var regexString = '{{' + prop + '}}';
      html = html.replace(new RegExp(regexString, 'ig'), data[prop]);
    }

    return html;
  }
}

module.exports = createTemplate;
