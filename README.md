endow
=====

endow common JavaScript objects with special abilities


## Promising
### Promise Consumption

```
var fauxPromise = {
  then: function (cb) { 
    setTimeout(function () { cb('some data') }, 2000)
  }  
};

var o = endow({}, 'prop');
o.prop = fauxPromise;
//2 seconds later o.prop === 'some data'

```

## Binding
### DOM-Binding
Given the folliwing HTML: 
```
<div id=foo></div>
```
#### Binding to innerHTML
```
var foo = document.createElement('foo'),
  o = endow({foo:foo});

o.foo = 'shoe';
console.log(foo.innerHTML); //'shoe'

//if binding is two way this also works:
foo.innerHTML = 'clue';
console.log(o.foo); //clue

```
#### Binding to attributes
```
var foo = document.createElement('foo'),
  o = endow({}, 'foo', {element:foo, attr: 'data-bar'});

o.foo = 'shoe';
console.log(foo.getAttribute('data-bar')); //'shoe'

//if binding is two way this also works:
foo.setAttribute('data-bar', 'clue');
console.log(o.foo); //clue

```
#### Declarative binding
Givin HTML:
```
<div id=foo bind='data-bar' bind-inner='html'></div>
```
We can do:
```
var o=endow({foo:foo});

o.foo = 'shoe';
console.log(foo.getAttribute('data-bar')); //'shoe'
console.log(foo.innerHTML); //'shoe'

//if binding is two way this also works:
foo.setAttribute('data-bar', 'clue');
console.log(o.foo); //clue
console.log(foo.innerHTML); //clue

foo.innerHTML = 'pew';
console.log(o.foo); //pew
console.log(foo.getAttribute('data-bar')); //'pew'


```


## Watching
### Auto-Endowing new properties


## Config
### Global Config

Set config options with endow.config (defaults flags are shown)
  
```
endow.config({
  watching: true, 
  binding: 2, //can be false, 1 or 2
  promising: true,
})
```


##  Utilities

### keys

Get just the endowed keys on an object

```
var o = {a: 2, b: 3};
endow(o);
o.c = 4;
endow.keys(o); // ['a', 'b']
```


