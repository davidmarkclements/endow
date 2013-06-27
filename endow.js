;(function(g) {
  var store = {}, defaults = {
    binding: 2,
    watching: true,
    promising: true
  }, config = {};

  reset(true); //initialise config;

  function reset (justConfig) { 
    function resCfg() {
      Object.keys(defaults).forEach(function (k) { 
        config[k] = defaults[k];
      });  
    }
    if (justConfig) { resCfg(); return; }    
    config.watching = false; //(disables the watcher)
    requestAnimationFrame(function () {
      resCfg();
      store = {}; //clear the store
    }) //give the watcher a chance to disable        
  }

  function get(o, what, binding) { return function () { 
    if (!binding || config.binding < 2) { 
      return store[o.Endowed][what];
    }

    function outofProp(boundTo) { 
      return binding.element[boundTo];
    }

    function getAttribute(boundTo, attr) { 
      attr = Array.isArray(attr) ? attr[0] : attr;
      return binding.element.getAttribute(attr);
    }

    var ops = {
      innerHTML: outofProp,
      innerText: outofProp,
      textContent: outofProp,
      attr: getAttribute
    }, bKeys = Object.keys(binding), opPrecendence = ['innerHTML','innerText', 'textContent', 'attr'],
      bFilt = bKeys.filter(function (key) { return ~opPrecendence.indexOf(key); }),
      op;

    if (!bFilt.length) {  return store[o.Endowed][what]; }
    
    op = bFilt[0];

    return ops[op](op, binding[op]);
  }}

  function set(o, what, binding) { return function (v) {

    if (isElement(v)) { 
      binding = binding || {element:v, innerHTML: true}
      v = v.innerHTML; 
    }

    var bind = function (val) {
      if (!config.binding) { 
        return;
      }
      if (!binding) { return; }
      function intoProp(bindingTo) {
        binding.element[bindingTo] = val;
      }

      function viaMeth(bindingTo, arr) {
        bindingTo = bindingTo === 'attr' ? 'setAttribute' : bindingTo;

        arr = Array.isArray(arr) ? arr : [arr];
        arr.push(v);
        binding.element[bindingTo].apply(binding.element, arr);
      }

      var ops = {
        innerHTML: intoProp,
        innerText: intoProp,
        textContent: intoProp,
        attr: viaMeth
      }

      Object.keys(binding).forEach(function (key) { 
        ops[key] && ops[key](key, binding[key]);
      })
      

    }

    if (config.promising && v && v.then) { 
      v.then(function (p) { 
        store[o.Endowed][what] = p;
        bind(p);
      });
      return v;
    }

    store[o.Endowed][what] = v;
    bind(v);
    return v;
  }}

  function WithAbilities() { 
    if (! (this instanceof WithAbilities)) {
      return new WithAbilities();
    }
    var d = Date.now();
    this.toString = function () { 
      return d;
    }

  }

  function isElement(o){
    return (
      typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
      o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string");
  }


  function endow(o, prop, binding) {
    if (typeof prop === 'object') {
      binding = prop;
      prop = undefined;
    }
    
    if (!o.Endowed) {          
      Object.defineProperty(o, 'Endowed', {
        value:WithAbilities(),
        writable:true,
        enumerable:false,
        configurable:false,
      });
    }

    store[o.Endowed] = store[o.Endowed] || {};

    function autobind(p, binding) {
      if (!isElement(o[p])) { return binding; }


      if (binding) { 
        binding = (function (keys) { var o = {}; keys.forEach(function (k) { o[k] = binding[k] }); 
          return o; }(Object.keys(binding)))

        binding.element = o[p];
        console.log(binding);
        return binding;
      }

      var b, bound;

      binding = {element:o[p]}
      b = o[p].getAttribute('bind');
      if (b) {
        binding.attr = b;
        bound = true;
      }
      b = o[p].getAttribute('bind-inner');

      if (b === 'html') {
        binding.innerHTML = true;
        bound = true;
      }
      if (b === 'text') {
        binding.innerText = true;
        bound = true;
      }
      if (b === 'textContent') {
        binding.textContent = true;
        bound = true;
      }

       binding = bound ? binding : {element:o[p], innerHTML: true};

       return binding;
    }

    function add(p) {
      if (p === 'Endowed') {return;}

      binding = autobind(p, binding);


      if (o[p]) { store[o.Endowed][p] = o[p]; delete o[p]; }

      Object.defineProperty(o, p, {get: get(o, p, binding), set: set(o, p, binding), enumerable: true, configurable:true});
      // o[p] = o[p] || undefined;

    }

    if (!prop) { 
      Object.keys(o).forEach(add);
      return o;
    }
    
    add(prop);
    return o;

  }

  endow.config = function (cfg) { 
    if (!cfg) { return config; }
    Object.keys(cfg).forEach(function (k) { 
      config[k] = cfg[k];
    });
    return config;  
  }

  endow.reset = reset;

  endow.keys = function (o) {
    return Object.keys(store[o.Endowed])
  }

  function watch(o) {
    (function watcher() {
      if (~-Object.keys(o).length) { endow(o); }   
      if (!config.watching) { return; }     
      requestAnimationFrame(watcher);
    }());    
  }

  endow.watch = watch;

  Object.defineProperty(endow, 'binding', {
    get: function () { return config.binding; }, 
    set: function (v) { config.binding = v; }
  })


  Object.defineProperty(endow, 'watching', {
    get: function () { return config.watching; }, 
    set: function (v) { config.watching = v; }
  })


  Object.defineProperty(endow, 'promising', {
    get: function () { return config.promising; }, 
    set: function (v) { config.promising = v; }
  })
  

  g.endow = endow;

}(window));



// Polyfills...


// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
 
// MIT license
 
;(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());