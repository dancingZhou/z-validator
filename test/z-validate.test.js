var chai = require('chai')
var valid = require('../dist/js/z-validate.js')
var expect = require('chai').expect
valid = valid.default
describe('检查一个错误', function () {
  it('测试通过', function () {
    var rules = {
      a: 'required',
      b: 'isPhone'
    }
    var vali = new valid(rules)
    
    expect(vali.check({
      a: '1',
      b: 11
    })).to.be.deep.equal({valid: true, msg: ""})
  })

  it('测试未通过', function () {
    var rules = {
      a: 'required',
      b: 'isPhone'
    }

    var vali = new valid(rules)

    expect(vali.check({
      a: '',
      b: '11'
    })).to.be.deep.equal({valid: false, msg: "不能为空"})
  })
})


describe('检查多个错误', function () {
  it('测试通过', function () {
    var rules = {
      a: 'required',
      b: 'isPhone'
    }
    var vali = new valid(rules)
    
    expect(vali.checkAll({
      a: '1',
      b: 11
    })).to.be.deep.equal({valid: true, msg: ""})
  })

  it('测试未通过', function () {
    var rules = {
      a: 'required',
      b: 'isPhone'
    }

    var vali = new valid(rules)

    expect(vali.checkAll({
      a: '',
      b: '11'
    })).to.be.deep.equal([{valid: false, msg: "不能为空"}, {valid: false, msg: "请输入正确的时候及号码"}])
  })
})
