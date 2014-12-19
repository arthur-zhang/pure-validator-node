var assert = require('assert');
var validator = require('pure-validator');
var NodeValidator = require('../lib/node-validator');
validator.extend({
  'isAppKey': {
    fn: function(value) {
      return validator.isHexadecimal(value) && value.length === 40;
    }
    ,
    message: 'xxx'
  }
});
var nodeValidator = new NodeValidator(validator);
var req = {
  query: {
    stringTestOk: '1',
    stringTestFail: 1,
    numTestOk: 1,
    numTestFail: '1',
    appKey: 's9909090'
  }
}
nodeValidator.check(req,
  {
    'query.stringTestOk': ['isTypeString'],
    'query.stringTestFail': ['isTypeString'],
    'query.numTestOk': ['isTypeNumber'],
    'query.numTestFail': ['isTypeNumber'],
    'query.appKey': ['isAppKey']
  }
);

console.log(nodeValidator.errors);


