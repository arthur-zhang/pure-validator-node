function NodeValidator(validator) {
  this.validator = validator;
}

NodeValidator.prototype.check = function(target, rules) {
  if (!this.validator) {
    throw new Error('validator is not specified');
  }
  var value;
  var attr;
  var rule;
  for (attr in rules) {
    rule = rules[attr];
    value = deepGet(target, attr);

    var optionalIndex = rule.indexOf('optional');
    if (optionalIndex !== -1) {
      if (value === undefined) {
        continue;
      }
      rule.splice(optionalIndex, 1);
    }
    if (value === undefined) {
      this._addError(attr, 'undefined', "Field missing");
      continue;
    }
    for (var i = 0; i < rule.length; i++) {
      var item = rule[i];
      var result;
      if (typeof item === 'string') {
        if (!this.validator[item]) {
          throw new Error('method validator[' + item + '] is not defined');
          continue;
        }
        result = this.validator[item].apply(this.validator, [value]);
        if (!result) {
          this._addError(attr, value, this.validator.getMessage(item));
        }
      } else if (typeof item === 'object') {
        for (var j in item) {
          var func = j;
          var param =  [value, item[j]];
          result = this.validator[func].apply(this.validator, param);
          if (!result) {
            this._addError(attr, value,  this.validator.getMessage(func));
          }
        }
      }
    }
  }
};

//NodeValidator.prototype.checkValue = function(key, value, rule) {
//  var target = {};
//  target[key] = value;
//  var rules = {}
//  rules[key] = rule;
//  this.check(target, rules);
//}

function deepGet(obj, path) {
  var keys = path.split('.');
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (obj === undefined || !obj.hasOwnProperty(key)) {
      obj = undefined;
      break;
    }
    obj = obj[key];
  }
  return obj;
}

NodeValidator.prototype._addError = function(key, value, message) {
  if (!this.errors) {
    this.errors = [];
  }
  this.errors.push({
    key: key,
    value: value,
    message: message
  })
};

module.exports = NodeValidator;