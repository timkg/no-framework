var StaticView = require('./../src/view/staticView');
var assert = require('assert');

describe('staticView', function () {
  describe('StaticView constructor', function () {
    it('creates staticView instances', function () {
      var templateString = '<div><h1>{{header}}</h1><p>{{text}}</p></div>';
      var view = new StaticView(templateString);
      assert(typeof view === 'object');
    });
  });

  describe('staticView instance', function () {
    it('returns html string on render', function () {
      var templateString = '<div><h1>{{header}}</h1><p>{{text}}</p></div>';
      var view = new StaticView(templateString);
      var rendered = view.render();
      assert(templateString === rendered);
    });

    it('replaces data with placeholders on render', function () {
      var templateString = '<div><h1>{{header}}</h1><p>{{text}}</p></div>';
      var view = new StaticView(templateString);

      var render = view.render({
        header: 'Title',
        text: 'Copy'
      });
      assert(render === '<div><h1>Title</h1><p>Copy</p></div>');
    });

    it('can be rendered multiple times with different data', function () {
      var templateString = '<div><h1>{{header}}</h1><p>{{text}}</p></div>';
      var view = new StaticView(templateString);

      var firstRender = view.render({
        header: 'Title',
        text: 'Copy'
      });
      assert(firstRender === '<div><h1>Title</h1><p>Copy</p></div>');

      var secondRender = view.render({
        header: 'Another title',
        text: 'Some more copy'
      });
      assert(secondRender === '<div><h1>Another title</h1><p>Some more copy</p></div>');
    });
  });
});
