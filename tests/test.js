var jsdom = require('jsdom'), 
  fs = require('fs'),
  should = require('chai').should(),
  endow = fs.readFileSync('../endow.js').toString(),
  chai = fs.readFileSync('./chai.js').toString(),
  //variables for the tests:
  window, endow, d, foo, pew,
  defaults = {
    binding: 2,
    watching: true,
    promising: true
  };


/**
 * Mocha qUnit interface.
 */
  /** @name test @function */
  /** @name suite @function */
  /** @name before @function */
  /** @name after @function */
  /** @name beforeEach @function */
  /** @name afterEach @function */

before(function () { 

  jsdom.env({
    html: '<div id=foo></div><div id=pew></div>',
    src: [endow, chai, 'chai.should()'],
    done: test
  });

  function test (err, wdw) {
    window = wdw;
    endow = window.endow,
    d = window.document,
    foo = d.getElementById('foo'),
    pew = d.getElementById('pew');
    
  }

})

afterEach(function () { 
  endow.reset();
})

beforeEach(function () { 
  foo.innerHTML = '';
  pew.innerHTML = '';

})


suite('endow#config')

test('returns a config object', function () { 
  var cfg = endow.config();
  cfg.should.be.an('object')
  cfg.should.have.property('watching')
  cfg.should.have.property('promising')
  cfg.should.have.property('binding')
})


test('takes a config object and merges properties with internal config', function () { 
  var cfg = endow.config({watching:false, promising:false, binding:false});

  cfg.should.eql({watching:false, promising:false, binding:false})
})

suite('endow#reset')

test('resets the config (with true parameter)', function () {   
  endow.config({watching:false, promising:false, binding:false});
  endow.reset(true);
  endow.config().should.eql(defaults)  
});

test('resets the config asynchronously (without true parameter)', function (done) {   
  endow.config({watching:false, promising:false, binding:false});
  endow.reset();
  setTimeout(function () { 
    endow.config().should.eql(defaults)
    done();
  }, 60)  
});


suite('endow')

test('returns an endowed object "{Endowed: WithAbilities}"', function () { 
  endow.reset(true);//just to be sure
  var o = {}, n;
  endow(o);
  
  o.should.have.property('Endowed')
  o.Endowed.should.be.an('object') //the WithAbilities object
  n = +(o.Endowed + '');
  n.should.be.a('number');

})

suite('endow(o, prop)')

test('adds/converts a property accessor to/on an object', function() {
  var o = {a:1}, bPropDesc, aPropDesc;

  endow(o, 'b');

  bPropDesc = Object.getOwnPropertyDescriptor(o, 'b');
  aPropDesc = Object.getOwnPropertyDescriptor(o, 'a');

  should.not.exist(bPropDesc.value)
  should.exist(bPropDesc.get)
  should.exist(bPropDesc.set)

  should.exist(aPropDesc.value)
  should.not.exist(aPropDesc.get)
  should.not.exist(aPropDesc.set)

  endow(o, 'a');
  aPropDesc = Object.getOwnPropertyDescriptor(o, 'a');

  should.not.exist(aPropDesc.value)
  should.exist(aPropDesc.get)
  should.exist(aPropDesc.set)

  o.b = 2;
  o.b.should.equal(2);
})

suite('endow(o, prop, binding)')


test('config.binding is 2 & innerHTML: true, two-way binds a property to an elements innerHTML', function () {
  var o = {};
  endow.config({binding:2})
  endow(o, 'foo', {element: foo, innerHTML: true})
  o.foo = 'test';
  foo.innerHTML.should.equal('test')
  foo.innerHTML = 'two-way test';
  o.foo.should.equal('two-way test');
})

test('config.binding is 2 & attr, two-way binds a property to an elements attribute', function () {
  var o = {};
  endow.config({binding:2})
  endow(o, 'pew', {element: pew, attr: 'data-pew'})
  o.pew = 'test';
  pew.getAttribute('data-pew').should.equal('test')
  foo.setAttribute('data-pew', 'two-way test');
  o.pew.should.equal('two-way test');
})


test('config.binding is 2 & innerText: true, two-way binds a property to an elements innerText', function () {
  var o = {};
  endow.config({binding:2})
  endow(o, 'foo', {element: foo, innerText: true})
  o.foo = 'test2';
  foo.innerText.should.equal('test2')
  foo.innerText = 'two-way test2';
  o.foo.should.equal('two-way test2');
})


test('config.binding is 2 & textContent: true, two-way binds a property to an elements innerText', function () {
  var o = {};
  endow.config({binding:2})
  endow(o, 'foo', {element: foo, textContent: true})
  o.foo = 'test3';
  foo.textContent.should.equal('test3')
  foo.textContent = 'two-way test3';
  o.foo.should.equal('two-way test3');
})

test('config.binding is 1 & innerHTML: true, two-way binds a property to an elements innerHTML', function () {
  var o = {};
  endow.config({binding:1})
  endow(o, 'foo', {element: foo, innerHTML: true})
  o.foo = 'test';
  foo.innerHTML.should.equal('test')
  foo.innerHTML = 'two-way test';
  o.foo.should.not.equal('two-way test');
})

test('config.binding is 1 & attr, two-way binds a property to an elements attribute', function () {
  var o = {};
  endow.config({binding:1})
  endow(o, 'pew', {element: pew, attr: 'data-pew'})
  o.pew = 'test';
  pew.getAttribute('data-pew').should.equal('test')
  foo.setAttribute('data-pew', 'two-way test');
  o.pew.should.not.equal('two-way test');
})


test('config.binding is 1 & innerText: true, two-way binds a property to an elements innerText', function () {
  var o = {};
  endow.config({binding:1})
  endow(o, 'foo', {element: foo, innerText: true})
  o.foo = 'test2';
  foo.innerText.should.equal('test2')
  foo.innerText = 'two-way test2';
  o.foo.should.not.equal('two-way test2');
})


test('config.binding is 1 & textContent: true, two-way binds a property to an elements innerText', function () {
  var o = {};
  endow.config({binding:1})
  endow(o, 'foo', {element: foo, textContent: true})
  o.foo = 'test3';
  foo.textContent.should.equal('test3')
  foo.textContent = 'two-way test3';
  o.foo.should.not.equal('two-way test3');
})


test('config.binding is false, does no binding in all cases', function () {
  var o = {};
  endow.config({binding:false})
  endow(o, 'pew', {element: pew, innerHTML: true})
  o.pew = 'test3';
  pew.innerHTML.should.not.equal('test3')
  pew.innerHTML = 'two-way test3';
  o.pew.should.not.equal('two-way test3');
})


suite('endow(o)')

suite('promise resolving')

suite('autoupdating (watching)')

suite('declarative binding')







