'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var untils = {
  /**
   * 获取数据类型
   * @param  {需要找出类型的数据} data [description]
   * @return {type}      
   * string
   * number
   * boolean
   * null
   * undefined
   * function
   * array
   * error
   * regexp
   * date
   * symbol
   */
  typeof: function _typeof(data) {
    var type = Object.prototype.toString.call(data).match(/\[object (\w*)\]/)[1];
    return type.toLowerCase();
  }
};

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
 * {
 *   field: {rule: '', errorMsg: ''}
 * }
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
              var _data = data[item],
                  _rules = rules[item],
                  errorMsg = void 0,
                  methodNames = void 0;
              if ((typeof _rules === 'undefined' ? 'undefined' : _typeof2(_rules)) === 'object' && _rules) {
                errorMsg = _rules.errorMsg;
                _rules = _rules.rules;
              }

              // 可能自定义函数来处理
              if (typeof _rules === 'string') {
                methodNames = _rules.split('|');
              } else if (untils.typeof(_rules) === 'function') {
                // 这里只能是函数
                methodNames = [_rules];
              }

              var methodReducer = methodNames.map(function (item, index) {
                return function (next) {
                  return function (data) {
                    var res = untils.typeof(item) === 'function' ? item(_data) : staticRules[item](_data, errorMsg);

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

exports.default = Zvalidate;