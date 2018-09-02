const untils = {
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
  typeof: function (data) {
    var type = Object.prototype.toString.call(data).match(/\[object (\w*)\]/)[1]
    return type.toLowerCase()
  }
}


const staticRules = {
  // 必须有这个字符串并且不能为''
  required (value, msg = '不能为空') {
    let valid = value != null && value !== ''

    msg = valid ? undefined : msg
    return {
      valid,
      msg
    }
  },
  isPhone (value, msg = '请输入正确的时候及号码') {
    let valid = typeof value === 'number'
    msg = valid ? undefined : msg
    return {
      valid,
      msg
    }
  }
}

/**
 * rules ---> {field: 'rule1:|rule2|rule3', field2: fn}
 * {
 *   field: {rule: '', errorMsg: ''}
 * }
 */

class Zvalidate {
  constructor (rules) {
    this.rules = rules
    this._validFn = this._getFnByRules(this.rules)

  }

  compose () {
    var chains = Array.prototype.slice.apply(arguments)
    // fn是需要增强的函数
    return function (fn) {
      return chains.reduceRight(function (prev, cur) {
        return cur(prev)
      }, fn)
    }
  }

  _getFnByRules (rules) {
    return function (checkAll = 0) {
      const self = this
      const results = []
      const ruleKeys = Object.keys(rules)
      this.fns = ruleKeys.map(function (item, index) {
        return function (next) {
          return function (data) {
            // 获取需要验证的数据
            let _data = data[item], _rules = rules[item], errorMsg, methodNames
            if (typeof _rules === 'object' && _rules) {
              errorMsg = _rules.errorMsg
              _rules = _rules.rules
            }

            // 可能自定义函数来处理
            if (typeof _rules === 'string') {
              methodNames = _rules.split('|')
            } else if (untils.typeof(_rules) === 'function') {
              // 这里只能是函数
              methodNames = [_rules]
            } 
            

            const methodReducer = methodNames.map(function (item, index) {
              return function (next) {
                return function (data) {
                  let res = untils.typeof(item) === 'function' ? 
                            item(_data) 
                            : 
                            staticRules[item](_data, errorMsg)

                  if (res.valid) {
                    return next(data)
                  } else {
                    return res
                  }
                }
              }
            })
            const res = self.compose(...methodReducer)(function () {return {valid: true, msg: ''}})(data)

            if (res.valid) {
              return next(data)
            } else {
              if (checkAll) {
                results.push(res)
                next(data)
                return results
              } else {
                return res
              }
            }
          }
        }
      })
      const ab = this.compose(...this.fns)(function () {
        return {valid: true, msg: ''}
      })
      return function (data) {
        return ab(data)
      }
    }
    
  }

  // 根据规则来验证数据
  check (data) {
    return this._validFn(0)(data)
  }

  checkAll (data) {
    return this._validFn(1)(data)
  }
}

module.exports = Zvalidate
