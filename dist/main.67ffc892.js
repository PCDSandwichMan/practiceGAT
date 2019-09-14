// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/parcel/src/builtins/_empty.js":[function(require,module,exports) {

},{}],"node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"node_modules/path-browserify/index.js":[function(require,module,exports) {
var process = require("process");
// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

},{"process":"node_modules/process/browser.js"}],"node_modules/dotenv/lib/main.js":[function(require,module,exports) {
var process = require("process");
/*::

type DotenvParseOptions = {
  debug?: boolean
}

// keys and values from src
type DotenvParseOutput = { [string]: string }

type DotenvConfigOptions = {
  path?: string, // path to .env file
  encoding?: string, // encoding of .env file
  debug?: string // turn on logging for debugging purposes
}

type DotenvConfigOutput = {
  parsed?: DotenvParseOutput,
  error?: Error
}

*/
var fs = require('fs');

var path = require('path');

function log(message
/*: string */
) {
  console.log("[dotenv][DEBUG] ".concat(message));
}

var NEWLINE = '\n';
var RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;
var RE_NEWLINES = /\\n/g;
var NEWLINES_MATCH = /\n|\r|\r\n/; // Parses src into an Object

function parse(src
/*: string | Buffer */
, options
/*: ?DotenvParseOptions */
)
/*: DotenvParseOutput */
{
  var debug = Boolean(options && options.debug);
  var obj = {}; // convert Buffers before splitting into lines and processing

  src.toString().split(NEWLINES_MATCH).forEach(function (line, idx) {
    // matching "KEY' and 'VAL' in 'KEY=VAL'
    var keyValueArr = line.match(RE_INI_KEY_VAL); // matched?

    if (keyValueArr != null) {
      var key = keyValueArr[1]; // default undefined or missing values to empty string

      var val = keyValueArr[2] || '';
      var end = val.length - 1;
      var isDoubleQuoted = val[0] === '"' && val[end] === '"';
      var isSingleQuoted = val[0] === "'" && val[end] === "'"; // if single or double quoted, remove quotes

      if (isSingleQuoted || isDoubleQuoted) {
        val = val.substring(1, end); // if double quoted, expand newlines

        if (isDoubleQuoted) {
          val = val.replace(RE_NEWLINES, NEWLINE);
        }
      } else {
        // remove surrounding whitespace
        val = val.trim();
      }

      obj[key] = val;
    } else if (debug) {
      log("did not match key and value when parsing line ".concat(idx + 1, ": ").concat(line));
    }
  });
  return obj;
} // Populates process.env from .env file


function config(options
/*: ?DotenvConfigOptions */
)
/*: DotenvConfigOutput */
{
  var dotenvPath = path.resolve(process.cwd(), '.env');
  var encoding
  /*: string */
  = 'utf8';
  var debug = false;

  if (options) {
    if (options.path != null) {
      dotenvPath = options.path;
    }

    if (options.encoding != null) {
      encoding = options.encoding;
    }

    if (options.debug != null) {
      debug = true;
    }
  }

  try {
    // specifying an encoding returns a string instead of a buffer
    var parsed = parse(fs.readFileSync(dotenvPath, {
      encoding: encoding
    }), {
      debug: debug
    });
    Object.keys(parsed).forEach(function (key) {
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        process.env[key] = parsed[key];
      } else if (debug) {
        log("\"".concat(key, "\" is already defined in `process.env` and will not be overwritten"));
      }
    });
    return {
      parsed: parsed
    };
  } catch (e) {
    return {
      error: e
    };
  }
}

module.exports.config = config;
module.exports.parse = parse;
},{"fs":"node_modules/parcel/src/builtins/_empty.js","path":"node_modules/path-browserify/index.js","process":"node_modules/process/browser.js"}],"javascript/main.js":[function(require,module,exports) {
if ("development" !== 'production') {
  require('dotenv').config();
} // ! CSS Buttons Functions
// ? Background Change


var changeBG = document.getElementById('backgroundChange');
changeBG.addEventListener('click', backgronudImageChange);

function backgronudImageChange() {
  var newImage = 'url(../images/getRolled.png) no-repeat center center fixed';
  var imageDefaults = document.body.style;
  setTimeout(function () {
    document.body.classList.remove('getRolled');
  }, 4000);
  document.body.classList.add('getRolled');
} // ? Color Change


var changeColor = document.getElementById('changeTextColor');
changeColor.addEventListener('click', changeTextColor);

function changeTextColor() {
  var neonShadow = '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #e60073, 0 0 40px #e60073, 0 0 50px #e60073, 0 0 60px #e60073, 0 0 70px #e60073';
  var textTags = document.getElementsByClassName('card');

  for (i = 0; i < textTags.length; ++i) {
    if (textTags[i].style.textShadow == 'none' || textTags[i].style.textShadow == '') {
      textTags[i].style.textShadow = neonShadow;
    } else {
      textTags[i].style.textShadow = 'none';
    }
  }
} // ? Remove All CSS


var removeCSSVar = document.getElementById('removeCSS');
removeCSSVar.addEventListener('click', removeCSS);

function removeCSS() {
  setTimeout(function () {
    document.styleSheets[0].disabled = false;
  }, 4000);
  document.styleSheets[0].disabled = true;
} // ? Better Hover Effects


var btnUpgrade = document.getElementById('betterHover');
btnUpgrade.addEventListener('click', betterHover);

function betterHover() {
  var textTags = document.getElementsByClassName('card');

  for (i = 0; i < textTags.length; ++i) {
    textTags[i].classList.toggle('betterHover');
  }
} // ! API Buttons
// ? Reusable Modal
// * Modal Vars


var modalMainContainer = document.getElementsByClassName('modalMainContainer')[0];
var modalTitle = document.getElementsByClassName('modalTitle')[0];
var modalLoad = document.getElementsByClassName('LoaderBalls')[0];
var modalBody = document.getElementsByClassName('modalBody')[0];
var modalBodyImage = document.getElementsByClassName('modalBodyImage')[0];
var modalBodyText = document.getElementsByClassName('modalBodyText')[0];
var numbersInput = document.getElementById('numbersInput');
var modalFooter = document.getElementsByClassName('modalFooter')[0];
var modalFooterText = document.getElementsByClassName('modalFooterText')[0];
var modalFooterImage = document.getElementsByClassName('modalFooterImage')[0];
var modalButton = document.getElementsByClassName('modalButton')[0];
var closeBtn = document.getElementsByClassName('closeBtn')[0]; // ! Multi-use Modal Full Reset

function resetModal() {
  modalTitle.innerHTML = '';
  modalBodyImage.src = '';
  modalBodyText.innerHTML = '';
  modalFooterImage.style.display = 'none';
  modalFooterText.innerHTML = '';
  numbersInput.style.display = 'none';
  modalButton.style.display = 'none';
} //! ALL API DATA MODAL CARDS


var weatherModal = document.getElementById('getWeather');
var chuckFact = document.getElementById('getChuckFact');
var numberFact = document.getElementById('getNumberFact');
var nasaInfo = document.getElementById('getNasaInfo'); // ! API listeners

weatherModal.addEventListener('click', getWeather);
chuckFact.addEventListener('click', getChuckFact);
numberFact.addEventListener('click', getUserNumber);
nasaInfo.addEventListener('click', getNasaInfo); // * Modal Listeners

closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', outsideClick); // * Modal Functions

function openModal() {
  modalMainContainer.style.display = 'block';
  modalBodyImage.style.display = 'none';
  modalLoad.style.display = 'flex';
  modalTitle.innerHTML = 'Be Right Back';
  modalBodyText.innerHTML = 'Grabbing Your Button Information';
}

function closeModal() {
  modalMainContainer.style.display = 'none';
  resetModal();
}

function outsideClick(e) {
  if (e.target == modalMainContainer) {
    modalMainContainer.style.display = 'none';
    resetModal();
  }
} // ! Get the weather
// ? Get the weather


var isGeolocationEnabled = '';
var weatherURL = 'http://api.openweathermap.org/data/2.5/weather?';
var long = 0;
var lat = 0;
var otherQueries = 'units=imperial';
var weatherApikey = "&APPID=f815bde335c200f01cd0732879135a21"; // ? Helpers for get weather
// * gets the lat and long

function updateCoordinate(callback) {
  navigator.geolocation.getCurrentPosition(function (position) {
    var returnValue = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
    var jsonCookie = returnValue;
    callback(jsonCookie);
  });
} // * check if geolocation is disabled


navigator.permissions.query({
  name: 'geolocation'
}).then(function (status) {
  //   console.log(`Geolocation access has been ${status.state}`);
  isGeolocationEnabled = status.state;
}); // ? Click Event

var geoLocationCity = '';
var currentTemp = '';
var weatherDescription = '';
var iconCode = '';
var iconUrl = '';

function getWeather() {
  openModal();

  if (isGeolocationEnabled == 'granted' || isGeolocationEnabled == 'prompt') {
    updateCoordinate(function (cookie) {
      lat = cookie.latitude;
      long = cookie.longitude; // * Fetches API Data

      fetch("".concat(weatherURL, "lat=").concat(lat, "&lon=").concat(long).concat(weatherApikey, "&").concat(otherQueries)).then(function (response) {
        return response.json();
      }).then(function (myJson) {
        geoLocationCity = JSON.stringify(myJson.name); //   console.log(geoLocationCity);

        currentTemp = myJson.main.temp; //   console.log(currentTemp);

        weatherDescription = myJson.weather[0].description; //   console.log(weatherDescription);

        iconCode = myJson.weather[0].icon;
        iconUrl = 'http://openweathermap.org/img/w/' + iconCode + '.png'; //   console.log(iconCode);
        // ? Display in DOM

        modalTitle.innerHTML = geoLocationCity.replace('"', '').replace('"', '');
        modalBodyText.innerHTML = "The current weather is: ".concat(weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1), " at ").concat(currentTemp, " degrees.");
        modalBodyText.style.display = 'block';
        modalFooterImage.src = iconUrl;
        modalFooterImage.style.display = 'block';
        modalLoad.style.display = 'none';
      });
    });
  } else {
    alert('Geolocation is enabled or is not available in your current browser.');
  }
} //! Chuck Norris Facts API


var chuckFactUrl = 'https://api.chucknorris.io/jokes/random'; // * Fetches for random chuck fact

function getChuckFact() {
  openModal();
  fetch(chuckFactUrl).then(function (response) {
    if (response.ok) {
      return response.json();
    }
  }, function (error) {
    alert('Bad stuff happened and something broke');
    console.log(error);
  }).then(function (jsonResponse) {
    var chuckIcon = jsonResponse.icon_url;
    var chuckFact = jsonResponse.value;
    modalTitle.innerHTML = 'Chuck Fact';
    modalBodyText.innerHTML = chuckFact;
    modalBodyText.style.display = 'block';
    modalFooterImage.src = chuckIcon;
    modalFooterImage.style.display = 'block';
    modalLoad.style.display = 'none';
  });
} // ! Number Facts API


var inputFelid = document.getElementById('numbersInput');
var userNumber;

function showNumber(str) {
  //*callback for the fact fetch
  modalBodyText.innerText = str;
  modalBodyText.style.display = 'block';
} // ? get the value from the SEARCH TAG YOU NEED TO MAKE


function getUserNumber() {
  openModal();
  modalLoad.style.display = 'none';
  modalTitle.innerHTML = "What number's fact would you like?"; // * Displays and resets input and hide old body

  inputFelid.value = '';
  inputFelid.style.display = 'block';
  modalBodyText.style.display = 'none'; // * Styling for the input field

  modalFooterImage.style.display = 'block';
  modalFooterImage.src = 'images/questionMarkFire.ico';
  modalFooterImage.style = 'height: 10%; width: 10%';
  inputFelid.addEventListener('keypress', function (e) {
    var inputVal = inputFelid.value;
    var key = e.which || e.keyCode;

    if (key === 13) {
      //*check for enter key
      if (isNaN(inputVal)) {
        //* Number input check
        alert("INPUT MUST BE ALL NUMBERS! DON'T BREAK THE MATRIX NEO!");
        return false;
      }

      inputFelid.style.display = 'none'; // *hides input field
      //* fetches number fact and displays to modal

      (function () {
        var scriptTag = document.createElement('script');
        scriptTag.async = true;
        modalLoad.style.display = 'flex';
        scriptTag.src = "http://numbersapi.com/".concat(inputVal, "/math?callback=showNumber");
        document.body.appendChild(scriptTag);
        modalLoad.style.display = 'none';
      })();
    }
  });
} //! Nasa APOD (daily picture) API


apodUrl = "https://api.nasa.gov/planetary/apod?api_key=XRjUqrBTRbTO4FnyFmn2gFUMF2EGTdX3Jc51c3L4&hd=True"; //* fetches the APOD from the NASA API

function getNasaInfo() {
  openModal();
  fetch(apodUrl).then(function (response) {
    if (response.ok) {
      return response.json();
    }
  }, function (networkError) {
    alert('Bad stuff happened and something broke');
    console.log(networkError);
  }).then(function (jsonResponse) {
    modalTitle.innerHTML = jsonResponse.title;
    modalBodyText.innerHTML = jsonResponse.explanation;
    modalBodyText.style.display = 'block';
    modalBodyImage.src = jsonResponse.url;
    modalBodyImage.style.display = 'block';

    var copyrightFooter = function copyrightFooter() {
      if (jsonResponse.copyright) {
        modalFooterText.innerHTML = "&copy ".concat(jsonResponse.copyright);
      } else {
        modalFooterText.innerHTML = "&copy NASA";
      }
    };

    copyrightFooter();
    modalLoad.style.display = 'none';
    modalBodyImage.style.display = 'block'; //*counters reset
  });
} // ! Transform/Transition/Keyframe Buttons
// ? Main Variables


var speechReader = document.getElementById('speechReader');
var barrelRoll = document.getElementById('barrelRoll');
var lightsOff = document.getElementById('lightsOff');
var killButtons = document.getElementById('killButtons');
var fullPage = document.getElementsByClassName('fullPage')[0];
var headerTag = document.getElementsByTagName('header')[0]; // ? Button Event Listeners

speechReader.addEventListener('click', speechReaderActivate);
barrelRoll.addEventListener('click', doBarrelRoll);
lightsOff.addEventListener('click', turnLightsOff);
killButtons.addEventListener('click', killButtonsAnimation); // ? SpeechRecognition Button

function speechReaderActivate() {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
  recognition.start();
  openModal();
  modalLoad.style.display = 'none';
  modalTitle.innerHTML = 'Tell Me A Story';
  modalBodyText.innerHTML = '(Start Speaking)';

  recognition.onresult = function (event) {
    var current = event.resultIndex;
    var voiceTranscript = event.results[current][0].transcript; // console.log(voiceTranscript);
    // * Puts speech to text on modal and displays

    modalBodyText.innerHTML = voiceTranscript;
    modalButton.style.display = 'block';
  };
} //*reads the script


var speechToTextRead = document.getElementById('fixTalk');
speechToTextRead.addEventListener('click', readText);

function readText() {
  var speech = new SpeechSynthesisUtterance();
  speech.volume = 0.3;
  speech.rate = 0.8;
  speech.pitch = 1;
  speech.text = modalBodyText.innerHTML;
  window.speechSynthesis.speak(speech);
} //? Do a Barrel Roll button


function doBarrelRoll() {
  var allCards = document.getElementsByClassName('card');

  for (i = 0; i < allCards.length; ++i) {
    allCards[i].classList.toggle('rotated');
  }
} //? Controls lights of buttons


function turnLightsOff() {
  document.querySelector('*').classList.toggle('dimScreen');
} // ? Controls grid layout rearrange


function killButtonsAnimation() {
  var allCards = document.getElementsByClassName('card'); // * Causes all cards to fall off screen

  for (i = 0; i < allCards.length; ++i) {
    window.setTimeout(function () {
      return console.log('waiting');
    }, 2000);
    allCards[i].classList.add('killButtons');
  } // * Restores buttons for user after delay


  window.setTimeout(function () {
    alert('Thanks for playing! ( The buttons will come back shortly if your wish to continue playing. )');
  }, 1000);
  console.log('before');
  window.setTimeout(function () {
    console.log('during');

    for (i = 0; i < allCards.length; ++i) {
      allCards[i].classList.remove('killButtons');
    }
  }, 8000);
} //! Nav Bar Functionality
// * Variables for nav items


var apiNav = document.getElementById('apiNav');
var ttNav = document.getElementById('ttNav');
var jSNav = document.getElementById('jSNav');
var cssNav = document.getElementById('cssNav');
var dontNav = document.getElementById('dontNav'); //* Card Class Identifiers

var cssEffect = document.getElementsByClassName('cssEffect');
var ttEffect = document.getElementsByClassName('ttEffect');
var jSEffect = document.getElementsByClassName('jSEffect');
var apiEffect = document.getElementsByClassName('apiEffect'); // * Event listeners for nav highlight

apiNav.addEventListener('click', buttonGlowSelector);
ttNav.addEventListener('click', buttonGlowSelector);
jSNav.addEventListener('click', buttonGlowSelector);
cssNav.addEventListener('click', buttonGlowSelector);
dontNav.addEventListener('click', buttonGlowSelector); // ? Button Glowing effect when nav click

function buttonGlowAdd(btn) {
  var allCards = document.getElementsByClassName('card'); // console.log(btn[0].classList.value);

  if (!btn[0].classList.value.includes('buttonGlow')) {
    for (i = 0; i < allCards.length; ++i) {
      allCards[i].classList.remove('buttonGlow');
    }
  }

  for (i = 0; i < btn.length; ++i) {
    btn[i].classList.toggle('buttonGlow');
  }
}

function buttonGlowSelector(e) {
  // console.log(e.target.id);
  switch (e.target.id) {
    case 'apiNav':
      buttonGlowAdd(apiEffect);
      break;

    case 'ttNav':
      buttonGlowAdd(ttEffect);
      break;

    case 'jSNav':
      buttonGlowAdd(jSEffect);
      break;

    case 'cssNav':
      buttonGlowAdd(cssEffect);
      break;

    case 'dontNav':
      var alertSound = new Audio('../images/spookButton.mp3');
      alertSound.volume = 1;
      alertSound.play();
      setTimeout(function () {
        alert("Boo! ( See now you'll be scared for the whole day.... I told you not to press it..... )");
      }, 200);
      break;
  }
}
},{"dotenv":"node_modules/dotenv/lib/main.js"}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50127" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","javascript/main.js"], null)
//# sourceMappingURL=/main.67ffc892.js.map