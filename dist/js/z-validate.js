'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var staticRules = {
  // 必须有这个字符串并且不能为''
  required: function required(value) {
    var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '不能为空';

    var valid = value != null && value !== '';

    msg = valid ? undefined : msg;
    return {
      valid: valid,
      msg: msg
    };
  },
  isPhone: function isPhone(value) {
    var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '请输入正确的时候及号码';

    var valid = typeof value === 'number';
    msg = valid ? undefined : msg;
    return {
      valid: valid,
      msg: msg
    };
  }
};

/**
 * rules ---> {field: 'rule1:|rule2|rule3', field2: fn}
 */

var Zvalidate = function () {
  function Zvalidate(rules) {
    _classCallCheck(this, Zvalidate);

    this.rules = rules;
    this._validFn = this._getFnByRules(this.rules);
  }

  _createClass(Zvalidate, [{
    key: 'compose',
    value: function compose() {
      var chains = Array.prototype.slice.apply(arguments);
      // fn是需要增强的函数
      return function (fn) {
        return chains.reduceRight(function (prev, cur) {
          return cur(prev);
        }, fn);
      };
    }
  }, {
    key: '_getFnByRules',
    value: function _getFnByRules(rules) {
      return function () {
        var checkAll = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        var self = this;
        var results = [];
        var ruleKeys = Object.keys(rules);
        this.fns = ruleKeys.map(function (item, index) {
          return function (next) {
            return function (data) {
              // 获取需要验证的数据
              var _data = data[item];
              // 这里有问题，需要优化因为可能有多个条件用|风割
              var methodNames = rules[item].split('|');
              var methodReducer = methodNames.map(function (item, index) {
                return function (next) {
                  return function (data) {
                    var res = staticRules[item](_data);
                    if (res.valid) {
                      return next(data);
                    } else {
                      return res;
                    }
                  };
                };
              });
              var res = self.compose.apply(self, _toConsumableArray(methodReducer))(function () {
                return { valid: true, msg: '' };
              })(data);

              if (res.valid) {
                return next(data);
              } else {
                if (checkAll) {
                  results.push(res);
                  next(data);
                  return results;
                } else {
                  return res;
                }
              }
            };
          };
        });
        var ab = this.compose.apply(this, _toConsumableArray(this.fns))(function () {
          return { valid: true, msg: '' };
        });
        return function (data) {
          return ab(data);
        };
      };
    }

    // 根据规则来验证数据

  }, {
    key: 'check',
    value: function check(data) {
      return this._validFn(0)(data);
    }
  }, {
    key: 'checkAll',
    value: function checkAll(data) {
      return this._validFn(1)(data);
    }
  }]);

  return Zvalidate;
}();

// var a = new Zvalidate({
//   a: 'required|isPhone',
//   b: 'required',
//   c: 'isPhone'
// })

exports.default = Zvalidate;

// console.log(a.checkAll({a: '', b: 111, c: '1111'}))