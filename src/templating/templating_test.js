var makeTemplate = require('./templating');
var assert = require('assert');

describe('templating', function () {
  it('replaces curly braces with data', function () {
    var templateString = '<div><h1>{{header}}</h1><p>{{text}}</p></div>';
    var render = makeTemplate(templateString);
    var result = render({header: 'Test', text: 'Testing it'});
    assert(result === '<div><h1>Test</h1><p>Testing it</p></div>');
  });

  it('allows multiple calls to same template with different data', function () {
    var templateString = '<div><h1>{{header}}</h1><p>{{text}}</p></div>';
    var render = makeTemplate(templateString);
    var result1 = render({header: 'Test', text: 'Testing it'});
    var result2 = render({header: 'Test2', text: 'Testing it2'});

    assert(result1 === '<div><h1>Test</h1><p>Testing it</p></div>');
    assert(result2 === '<div><h1>Test2</h1><p>Testing it2</p></div>');
  });

  it('allows to create different templates', function () {
    var templateString1 = '<div><h1>{{header}}</h1><p>{{text}}</p></div>';
    var templateString2 = '<div><h2>{{header}}</h2><p>{{text}}</p></div>';
    var render1 = makeTemplate(templateString1);
    var render2 = makeTemplate(templateString2);

    var result1 = render1({header: 'Test', text: 'Testing it'});
    var result2 = render2({header: 'Test2', text: 'Testing it2'});

    assert(result1 === '<div><h1>Test</h1><p>Testing it</p></div>');
    assert(result2 === '<div><h2>Test2</h2><p>Testing it2</p></div>');
  })
});
