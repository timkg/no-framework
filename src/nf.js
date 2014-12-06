module.exports = {
  model: require('./model-view/createModel'),
  view: require('./model-view/createView'),
  template: require('./templating/templating'),
  observe: require('./observable/observe')
};
