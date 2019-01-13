// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
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

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
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
  return newRequire;
})({"../assets/levels.js":[function(require,module,exports) {
module.exports = {
  Astronaut: {
    speed: 1.9
  },
  Level1: {
    asteroid: {
      rate: 35,
      speed: 1.5,
      spread: 1
    },
    oxygen: {
      rate: 8,
      speed: 1.4,
      spread: 1
    },
    medic: {
      rate: 9,
      speed: 1.5,
      spread: 1
    }
  },
  Level2: {
    asteroid: {
      rate: 45,
      speed: 2,
      spread: 1
    },
    oxygen: {
      rate: 14,
      speed: 2,
      spread: 1
    },
    medic: {
      rate: 12,
      speed: 2,
      spread: 1
    }
  },
  Level3: {
    asteroid: {
      rate: 60,
      speed: 2,
      spread: 1.1
    },
    oxygen: {
      rate: 16,
      speed: 2,
      spread: 1.2
    },
    medic: {
      rate: 10,
      speed: 3,
      spread: 1.2
    }
  },
  Level4: {
    asteroid: {
      rate: 80,
      speed: 1.8,
      spread: 1.3
    },
    oxygen: {
      rate: 14,
      speed: 2,
      spread: 1.2
    },
    medic: {
      rate: 12,
      speed: 3,
      spread: 1.2
    }
  }
};
},{}],"../js/Mass.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

module.exports =
/*#__PURE__*/
function () {
  function Mass(width, height, type) {
    _classCallCheck(this, Mass);

    this.div = document.createElement('div');
    this.div.classList.add(type);
    this.dimensions = {
      x: width,
      y: height
    };
    this.position = {
      x: 0,
      y: 0
    };
  }

  _createClass(Mass, [{
    key: "getPosition",
    value: function getPosition() {
      var parentPos = content.getBoundingClientRect();
      var childPos = this.div.getBoundingClientRect();
      return {
        x: childPos.left - parentPos.left,
        y: childPos.top - parentPos.top
      };
    }
  }, {
    key: "intersects",
    value: function intersects(obj) {
      var objAPos = this.getPosition();
      var objBPos = obj.getPosition();
      return objAPos.x > objBPos.x - obj.dimensions.x && objAPos.x < objBPos.x + obj.dimensions.x && objAPos.y > objBPos.y - obj.dimensions.y && objAPos.y < objBPos.y + obj.dimensions.y;
    }
  }]);

  return Mass;
}();
},{}],"../js/Person.js":[function(require,module,exports) {
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Mass = require('./Mass');

module.exports =
/*#__PURE__*/
function (_Mass) {
  _inherits(Person, _Mass);

  function Person() {
    var _this;

    _classCallCheck(this, Person);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Person).call(this, 50, 50, 'astronaut'));
    _this.health = 100;
    _this.air = 100;
    _this.animationDuration = 2100;
    content.appendChild(_this.div); // this.entryAnimation();

    return _this;
  }

  _createClass(Person, [{
    key: "entryAnimation",
    value: function entryAnimation() {
      var that = this;
      var initialX = screenWidth / 2 - this.dimensions.x / 2;
      var initialY = screenHeight / 2 - this.dimensions.y / 2;
      anime({
        targets: that.div,
        translateX: [{
          value: initialX,
          duration: 0
        }],
        translateY: [{
          value: initialY,
          duration: 0
        }],
        scale: [{
          value: 0,
          duration: 100
        }, {
          value: 1,
          duration: 2000,
          delay: 100
        }],
        opacity: [{
          value: 1,
          delay: 100,
          duration: 1000
        }],
        rotate: [{
          value: '2turn',
          delay: 100,
          duration: 2000
        }],
        complete: function complete(anim) {
          that.position.x = initialX;
          that.position.y = initialY; // temporarily delay onset on keyDetection

          setTimeout(function () {
            game.keyDetect();
          }, 30);
        }
      });
    }
  }, {
    key: "affectStatus",
    value: function affectStatus(amount, type) {
      var attribute = type;
      var progress = "".concat(type, "Progress");

      if (amount + this[attribute] > 100) {
        this[attribute] = 100;
      } else {
        this[attribute] += amount;
      }

      anime({
        targets: game[progress],
        value: this[attribute],
        duration: 0,
        easing: 'linear'
      });

      if (this[attribute] === 0) {
        game.gameOver();
      }
    }
  }, {
    key: "setAirLoss",
    value: function setAirLoss(toLose) {
      var _this2 = this;

      if (toLose) {
        this.airInterval = setInterval(function () {
          if (_this2.air <= 0) {
            game.gameOver();
          }

          _this2.air -= 0.25;
          anime({
            targets: game.airProgress,
            value: _this2.air,
            duration: 1,
            easing: 'linear'
          });
        }, 100);
      } else {
        clearInterval(this.airInterval);
      }
    }
  }, {
    key: "move",
    value: function move(_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          x = _ref2[0],
          y = _ref2[1];

      anime({
        targets: this.div,
        translateX: this.position.x += x,
        translateY: this.position.y += y,
        elasticity: 0,
        duration: 100
      }); // detect if out of bounds

      if (this.position.x < -this.dimensions.x || this.position.y < -this.dimensions.y || this.position.y > screenHeight || this.position.x > screenWidth) game.gameOver();
    }
  }, {
    key: "reset",
    value: function reset() {
      this.health = 100;
      this.air = 100;
    }
  }]);

  return Person;
}(Mass);
},{"./Mass":"../js/Mass.js"}],"../js/Projectile.js":[function(require,module,exports) {
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Mass = require('../js/Mass');

module.exports =
/*#__PURE__*/
function (_Mass) {
  _inherits(Projectile, _Mass);

  function Projectile(width, height, type, speed) {
    var _this;

    _classCallCheck(this, Projectile);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Projectile).call(this, width, height, type));
    _this.active = true;
    _this.speed = game.levelRates[type].speed;
    _this.spread = game.levelRates[type].spread;
    return _this;
  }

  _createClass(Projectile, [{
    key: "release",
    value: function release(duration) {
      var points = this.createPaths();
      this.move(points[0], 0, false);
      this.animation = this.move(points[1], 10000 / this.speed, true);
    }
  }, {
    key: "createPaths",
    value: function createPaths() {
      var axis = Math.random() > 0.5 ? 'x' : 'y';
      var direction = Math.random() > 0.5 ? '+' : '-';
      var startPoint = this.generatePoint(axis, direction);
      var endPoint = this.generatePoint(axis, direction, startPoint);
      return [startPoint, endPoint];
    }
  }, {
    key: "generatePoint",
    value: function generatePoint(axis, direction, startPoint) {
      var point = [0, 0];

      if (!startPoint) {
        if (axis === 'x') {
          point[0] = direction === '+' ? -this.dimensions.x : screenWidth;
          point[1] = Math.random() * (screenHeight + this.dimensions.y) - this.dimensions.y;
        } else {
          // axis === 'y'
          point[0] = Math.random() * (screenWidth + this.dimensions.x) - this.dimensions.x;
          point[1] = direction === '+' ? -this.dimensions.y : screenHeight;
        }
      } else {
        // startPoint exists
        if (axis === 'x') {
          point[0] = (direction === '+' ? 1 : -1) * (screenWidth + this.dimensions.x);
          point[1] = Math.random() * this.spread * (screenHeight + this.dimensions.y) - startPoint[1];
        } else {
          // axis === 'y'
          point[0] = Math.random() * this.spread * (screenWidth + this.dimensions.x) - startPoint[0];
          point[1] = (direction === '+' ? 1 : -1) * (screenHeight + this.dimensions.y);
        }
      }

      return point;
    }
  }, {
    key: "move",
    value: function move(_ref, time, end) {
      var _this2 = this;

      var _ref2 = _slicedToArray(_ref, 2),
          x = _ref2[0],
          y = _ref2[1];

      return anime({
        targets: this.div,
        translateX: this.position.x += x,
        translateY: this.position.y += y,
        duration: time,
        easing: 'linear',
        elasticity: 0,
        run: function run(anim) {
          if (_this2.intersects(game.person) && _this2.active) {
            _this2.collides();
          }
        },
        complete: function complete() {
          if (end) {
            _this2.completesPath();
          }
        }
      });
    }
  }, {
    key: "collides",
    value: function collides() {
      console.log("Collision");
    }
  }, {
    key: "completesPath",
    value: function completesPath() {
      this.div.remove();
    }
  }]);

  return Projectile;
}(Mass);
},{"../js/Mass":"../js/Mass.js"}],"../js/Asteroid.js":[function(require,module,exports) {
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Projectile = require('./Projectile');

module.exports =
/*#__PURE__*/
function (_Projectile) {
  _inherits(Asteroid, _Projectile);

  function Asteroid(idNumber) {
    var _this;

    _classCallCheck(this, Asteroid);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Asteroid).call(this, 50, 50, 'asteroid'));
    _this.id = "asteroid-".concat(idNumber);
    content.appendChild(_this.div);
    return _this;
  }

  _createClass(Asteroid, [{
    key: "completesPath",
    value: function completesPath() {
      var _this2 = this;

      var deadIdx = game.asteroids.findIndex(function (asteroid) {
        return asteroid.id === _this2.id;
      });
      game.asteroids.splice(deadIdx, 1);

      _get(_getPrototypeOf(Asteroid.prototype), "completesPath", this).call(this);
    }
  }, {
    key: "collides",
    value: function collides() {
      var _this3 = this;

      if (!this.div.classList.contains('asteroid-hit')) {
        this.div.classList.add('asteroid-hit');
        setTimeout(function () {
          _this3.div.classList.remove('asteroid-hit');
        }, 1000);
      }

      game.person.affectStatus(-1, 'health');
    }
  }]);

  return Asteroid;
}(Projectile);
},{"./Projectile":"../js/Projectile.js"}],"../js/Medic.js":[function(require,module,exports) {
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Projectile = require('./Projectile');

module.exports =
/*#__PURE__*/
function (_Projectile) {
  _inherits(Medic, _Projectile);

  function Medic(idNumber, speed) {
    var _this;

    _classCallCheck(this, Medic);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Medic).call(this, 40, 40, 'medic', speed));
    _this.id = "medic-".concat(idNumber);
    return _this;
  }

  _createClass(Medic, [{
    key: "collides",
    value: function collides() {
      this.active = false;
      game.person.affectStatus(50, 'health');

      _get(_getPrototypeOf(Medic.prototype), "completesPath", this).call(this);
    }
  }, {
    key: "release",
    value: function release() {
      content.appendChild(this.div);

      _get(_getPrototypeOf(Medic.prototype), "release", this).call(this);
    }
  }, {
    key: "completesPath",
    value: function completesPath() {
      var _this2 = this;

      var deadIdx = game.medics.findIndex(function (medic) {
        return medic.id === _this2.id;
      });
      game.medics.splice(deadIdx, 1);

      _get(_getPrototypeOf(Medic.prototype), "completesPath", this).call(this);
    }
  }]);

  return Medic;
}(Projectile);
},{"./Projectile":"../js/Projectile.js"}],"../js/Oxygen.js":[function(require,module,exports) {
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Projectile = require('./Projectile');

module.exports =
/*#__PURE__*/
function (_Projectile) {
  _inherits(Oxygen, _Projectile);

  function Oxygen(idNumber) {
    var _this;

    _classCallCheck(this, Oxygen);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Oxygen).call(this, 26, 39, 'oxygen')); // this.div.innerHTML = 'O<sub>2</sub>'

    _this.id = "oxygen-".concat(idNumber);
    return _this;
  }

  _createClass(Oxygen, [{
    key: "collides",
    value: function collides() {
      this.active = false;
      game.person.affectStatus(30, 'air');

      _get(_getPrototypeOf(Oxygen.prototype), "completesPath", this).call(this);
    }
  }, {
    key: "release",
    value: function release() {
      content.appendChild(this.div);

      _get(_getPrototypeOf(Oxygen.prototype), "release", this).call(this);
    }
  }, {
    key: "completesPath",
    value: function completesPath() {
      var _this2 = this;

      var deadIdx = game.oxygens.findIndex(function (oxygen) {
        return oxygen.id === _this2.id;
      });
      game.oxygens.splice(deadIdx, 1);

      _get(_getPrototypeOf(Oxygen.prototype), "completesPath", this).call(this);
    }
  }]);

  return Oxygen;
}(Projectile);
},{"./Projectile":"../js/Projectile.js"}],"../js/app.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*----- constants -----*/
screenWidth = 800; // temporary - to be discovered dynamically

screenHeight = 500;
var timerLength = 15;

var rateMap = require('../assets/levels');

var Person = require('../js/Person');

var Asteroid = require('../js/Asteroid');

var Medic = require('../js/Medic');

var Oxygen = require('../js/Oxygen');
/*----- app's state (variables) -----*/


game = null; // temporary, shall be called otherwise

var person;

var Game =
/*#__PURE__*/
function () {
  function Game() {
    _classCallCheck(this, Game);

    this.projectiles = ['asteroids', 'medics', 'oxygens'];
    this.makeElements();
    this.attachKeyListeners();
    this.newGame();
    this.createStatusBars();
    this.createTimer();
  }

  _createClass(Game, [{
    key: "newGame",
    value: function newGame() {
      var _this = this;

      this.round = 0;
      this.asteroidCounter = 0;
      this.medicCounter = 0;
      this.oxygenCounter = 0;
      this.projectiles.forEach(function (projectile) {
        _this[projectile] = [];
      }); // create astronaut

      this.person = new Person();
      this.newRound();
    }
  }, {
    key: "newRound",
    value: function newRound() {
      this.round++;
      this.active = true;
      this.timer = 30; // destroy all projectiles

      if (this.round > 0) this.destroyProjectiles();
      this.roundNumber.textContent = this.round;
      this.levelRates = rateMap["Level".concat(this.round)];
      this.person.entryAnimation();
      this.startCountdown();
    }
  }, {
    key: "startCountdown",
    value: function startCountdown() {
      var _this2 = this;

      var count = 3;
      var countdownElement = document.createElement('h3');
      countdownElement.textContent = count;
      var countdownBox = document.createElement('section');
      countdownBox.classList.add('countdown');
      var overLay = document.createElement('div');
      overLay.classList.add('over-content');
      countdownBox.appendChild(countdownElement);
      overLay.appendChild(countdownBox);
      content.appendChild(overLay);
      var countdownInterval = setInterval(function () {
        if (count <= 1) {
          clearInterval(countdownInterval);
          countdownBox.removeChild(countdownElement);
          overLay.removeChild(countdownBox);
          content.removeChild(overLay);

          _this2.startRound();
        }

        count--;
        countdownElement.textContent = count;
      }, 1000);
    }
  }, {
    key: "startRound",
    value: function startRound() {
      this.releaseAsteroids();
      this.releaseMedics();
      this.releaseOxygen();
      this.resetTimer(timerLength);
      this.startTimer();
      this.person.setAirLoss(true);
    }
  }, {
    key: "attachKeyListeners",
    value: function attachKeyListeners() {
      var _this3 = this;

      // prevent scrolling
      window.addEventListener("keydown", function (e) {
        if (['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].indexOf(e.code) > -1) {
          e.preventDefault();
        }
      }, false); // attach key event listeners

      this.keys = {};
      window.addEventListener('keydown', function (e) {
        _this3.keys[e.code] = true;
      });
      window.addEventListener('keyup', function (e) {
        _this3.keys[e.code] = false;
      });
    }
  }, {
    key: "keyDetect",
    value: function keyDetect(e) {
      var _this4 = this;

      var x = (this.keys['ArrowLeft'] ? -1 : 0) + (this.keys['ArrowRight'] ? 1 : 0);
      var y = (this.keys['ArrowUp'] ? -1 : 0) + (this.keys['ArrowDown'] ? 1 : 0);
      x *= rateMap.Astronaut.speed;
      y *= rateMap.Astronaut.speed;

      if (x !== 0 || y !== 0) {
        this.person.move([x, y]);
      }

      ;
      if (this.active) setTimeout(function () {
        _this4.keyDetect();
      }, 20);
    }
  }, {
    key: "createStatusBars",
    value: function createStatusBars() {
      this.healthProgress = document.createElement('progress');
      this.healthProgress.classList.add('health-progress');
      this.healthProgress.setAttribute('max', 100);
      this.healthProgress.setAttribute('value', this.person.health);
      this.healthProgress.setAttribute('id', 'health-progress');
      var healthLabel = document.createElement('label');
      healthLabel.setAttribute('for', 'health-progress');
      healthLabel.textContent = 'Health';
      this.airProgress = document.createElement('progress');
      this.airProgress.classList.add('air-progress');
      this.airProgress.setAttribute('max', 100);
      this.airProgress.setAttribute('value', this.person.air);
      this.airProgress.setAttribute('id', 'air-progress');
      var airLabel = document.createElement('label');
      airLabel.setAttribute('for', 'air-progress');
      airLabel.textContent = 'Oxygen';
      this.progressBox = document.createElement('section');
      this.progressBox.classList.add('progress-box');
      this.progressBox.appendChild(healthLabel);
      this.progressBox.appendChild(this.healthProgress);
      this.progressBox.appendChild(document.createElement('br'));
      this.progressBox.appendChild(airLabel);
      this.progressBox.appendChild(this.airProgress);
      content.appendChild(this.progressBox);
    }
  }, {
    key: "makeElements",
    value: function makeElements() {
      var _this5 = this;

      // Level Information
      this.roundBox = document.createElement('section');
      this.roundBox.classList.add('round-box');
      this.roundLabel = document.createElement('label');
      this.roundLabel.textContent = 'Level: ';
      this.roundNumber = document.createElement('span');
      this.roundNumber.textContent = this.round;
      this.roundBox.appendChild(this.roundLabel);
      this.roundBox.appendChild(this.roundNumber);
      content.appendChild(this.roundBox); // Round Over Elements

      this.nextRoundBtn = document.createElement('button');
      this.nextRoundBtn.classList.add('next-round-btn');
      this.nextRoundBtn.textContent = 'Next Level';
      this.nextRoundBtn.addEventListener('click', function () {
        _this5.newRound();

        overScreenBackground.removeChild(_this5.roundOverContainer);
        content.removeChild(overScreenBackground);

        _this5.person.reset();
      });
      roundOverMsg.classList.add('round-over');
      this.roundOverContainer = document.createElement('section');
      this.roundOverContainer.classList.add('round-over-container'); // Game Completed Elements

      this.gameCompleteContainer = document.createElement('section');
      this.gameCompleteContainer.classList.add('game-complete-container');
      this.gameCompleteMessage = document.createElement('h3');
      this.gameCompleteMessage.textContent = 'Game Completed';
      this.gameCompleteSubmessage = document.createElement('h4');
      this.gameCompleteSubmessage.textContent = 'Check back later for more levels!';
      this.newGameBtn = document.createElement('button');
      this.newGameBtn.textContent = 'Play Again';
      this.newGameBtn.classList.add('play-again-btn');
      this.newGameBtn.addEventListener('click', function () {
        // destroy game
        _this5.endGame();

        _this5.newGame();
      });
      this.gameCompleteContainer.appendChild(this.gameCompleteMessage);
      this.gameCompleteContainer.appendChild(this.gameCompleteSubmessage);
      this.gameCompleteContainer.appendChild(this.newGameBtn);
    }
  }, {
    key: "endGame",
    value: function endGame() {
      overScreenBackground.removeChild(this.gameCompleteContainer);
      content.removeChild(overScreenBackground);
      this.destroyProjectiles();
      this.person.div.remove();
      this.person = null;
    }
  }, {
    key: "destroyProjectiles",
    value: function destroyProjectiles() {
      var _this6 = this;

      this.projectiles.forEach(function (type) {
        for (var i = _this6[type].length - 1; i >= 0; i--) {
          var projectile = _this6[type][i];
          projectile.completesPath();
        }
      });
    }
  }, {
    key: "gameOver",
    value: function gameOver(cause) {
      $(content).append($gameOverMsg);
      content.removeChild(this.levelOver);
      this.active = false;
      this.stopIntervals();
      this.stopProjectiles();
    }
  }, {
    key: "levelOver",
    value: function levelOver() {
      this.active = false;
      this.stopIntervals();
      this.stopProjectiles();
      content.appendChild(overScreenBackground);

      if (rateMap["Level".concat(this.round + 1)]) {
        roundOverMsg.textContent = "Level ".concat(this.round, " Complete!");
        this.roundOverContainer.appendChild(roundOverMsg);
        this.roundOverContainer.appendChild(this.nextRoundBtn);
        overScreenBackground.appendChild(this.roundOverContainer);
      } else {
        // game completed!
        overScreenBackground.appendChild(this.gameCompleteContainer);
      } // make next round button appear


      overScreenBackground.classList.remove('hidden');
    }
  }, {
    key: "stopIntervals",
    value: function stopIntervals() {
      clearInterval(this.asteroidInterval);
      clearInterval(this.person.setAirLoss(false)); // clearInterval(this.timerInterval);

      clearInterval(this.medicReleaseInterval);
      clearInterval(this.oxygenReleaseInterval);
    }
  }, {
    key: "releaseAsteroids",
    value: function releaseAsteroids() {
      var _this7 = this;

      this.asteroidInterval = setInterval(function () {
        var asteroid = new Asteroid(_this7.asteroidCounter++, _this7.levelRates.asteroid.speed);
        asteroid.release();

        _this7.asteroids.push(asteroid);
      }, 1000 / (this.levelRates.asteroid.rate / 60));
    }
  }, {
    key: "releaseMedics",
    value: function releaseMedics(rate) {
      var _this8 = this;

      // rate is # of releases per minute;
      // speed => duration = 10000 / speed
      this.medicReleaseInterval = setInterval(function () {
        // idNumber, speed
        var medic = new Medic(_this8.medicCounter++, _this8.levelRates.medic.speed);

        _this8.medics.push(medic);

        medic.release();
      }, 1000 / (this.levelRates.medic.rate / 60));
    }
  }, {
    key: "releaseOxygen",
    value: function releaseOxygen(rate, duration) {
      var _this9 = this;

      // rate is # of releases per minute;
      this.oxygenReleaseInterval = setInterval(function () {
        var oxygen = new Oxygen(_this9.oxygenCounter++, _this9.levelRates.oxygen.speed);

        _this9.oxygens.push(oxygen);

        oxygen.release(duration);
      }, 1000 / (this.levelRates.oxygen.rate / 60));
    }
  }, {
    key: "stopProjectiles",
    value: function stopProjectiles() {
      var _this10 = this;

      this.projectiles.forEach(function (proj) {
        for (var i = 0; i < _this10[proj].length; i++) {
          _this10[proj][i].animation.pause();
        }
      });
    }
  }, {
    key: "createTimer",
    value: function createTimer() {
      this.timerElement = document.createElement('progress');
      this.timerElement.setAttribute('max', this.timer);
      this.timerElement.setAttribute('value', this.timer);
      this.timerElement.setAttribute('id', 'timer');
      this.timerLabel = document.createElement('label');
      this.timerLabel.textContent = 'Timer';
      this.timerLabel.setAttribute('for', 'timer');
      this.timerSection = document.createElement('section');
      this.timerSection.classList.add('timer-section');
      this.timerSection.appendChild(this.timerLabel);
      this.timerSection.appendChild(this.timerElement);
      content.appendChild(this.timerSection);
    }
  }, {
    key: "resetTimer",
    value: function resetTimer(start) {
      this.timerElement.setAttribute('max', start);
      this.timerElement.setAttribute('value', this.timer);
      this.timer = start;
    }
  }, {
    key: "startTimer",
    value: function startTimer() {
      var _this11 = this;

      this.timerInterval = setInterval(function () {
        _this11.timer--;

        if (_this11.timer <= 0) {
          clearInterval(_this11.timerInterval);

          _this11.levelOver();
        }

        anime({
          targets: _this11.timerElement,
          value: _this11.timer,
          round: 1,
          duration: 0,
          easing: 'linear'
        });
      }, 1000);
    }
  }]);

  return Game;
}();
/*----- cached element references -----*/


var content = document.querySelector('#content');
var initActions = document.createElement('section');
var $gameOverMsg = $('<h2>Game Over</h2>').addClass('game-over');
var $howToBtn = $('<button/>').text('How to Play');
var roundOverMsg = document.createElement('h2');
var overScreenBackground = document.createElement('div');
/*----- event listeners -----*/

document.querySelector('.back-btn').addEventListener('click', function () {
  document.querySelector('#instructions').classList.toggle('hidden');
  initActions.classList.toggle('hidden');
});
$howToBtn.click(function () {
  document.querySelector('#instructions').classList.toggle('hidden');
  initActions.classList.toggle('hidden');
});
/*----- functions -----*/

init();

function init() {
  var $startBtn = $('<button/>').text('Start Game').on('click', newGame);
  $(initActions).append($startBtn);
  $(initActions).append($howToBtn);
  $(initActions).addClass('initial-actions');
  content.appendChild(initActions);
  overScreenBackground.classList.add('over-content');
}

function newGame() {
  content.removeChild(initActions);
  game = new Game();
}
},{"../assets/levels":"../assets/levels.js","../js/Person":"../js/Person.js","../js/Asteroid":"../js/Asteroid.js","../js/Medic":"../js/Medic.js","../js/Oxygen":"../js/Oxygen.js"}],"../../../.npm-global/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52035" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
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

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

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

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../.npm-global/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","../js/app.js"], null)
//# sourceMappingURL=/app.5a203f7e.map