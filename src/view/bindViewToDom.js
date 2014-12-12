var wrap = require('./../observable/wrapMethod');

function bindViewToDom (view, container) {
  container.innerHTML = view.html;
  wrap(view, 'render', function (html) {
    container.innerHTML = html;
  })
}

module.exports = bindViewToDom;
