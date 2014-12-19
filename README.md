# pure-validator-node

An nodejs validator for params, querystring, body or anything else, must use with [pure-validator](https://www.npmjs.com/package/pure-validator)

## Installation

```
npm install pure-validator-node
```

## Usage

```javascript

var express = require('express');
var app = new express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var NodeValidator = require('pure-validator-node');
var validator = require('pure-validator');

app.post('/:id', function(req, res) {
  var nodeValidator = new NodeValidator(validator);
  nodeValidator.check(req, {
    'params.id': ['isMongoId'],
    'query.ip': ['isIP'],
    'body.email': ['optional', 'isEmail'],
    'body.foo': ['isTypeString'],
    'body.action': [{
      isIn: ['install', 'publish', 'start']
    }]
  });
  if (nodeValidator.errors) {
    console.log(nodeValidator.errors);
  }
  res.status(400).json(nodeValidator.errors);
});
app.listen(3838);
```

```
curl -X POST -H "Content-Type: application/json" -d '{
  "action": "stop",
  "foo": 12
}' http://localhost:3838/ass?ip=1.1.1.s
```

#### `Error message`

```
[
  {
    key: 'params.id',
    value: 'ass',
    message: 'MongoId must match reg(/^[0-9a-fA-F]+$/;) and length must be 24'
  },
  {
    key: 'query.ip',
    value: '1.1.1.s',
    message: 'The value is not ip'
  },
  {
    key: 'body.foo',
    value: 12,
    message: 'The type of value must be type String'
  },
  {
    key: 'body.action',
    value: 'stop',
    message: 'Value must be in the specified array'
  }
]

```

####`customValidators`
```
var rules = {
  isDate: {
    fn: function(value) {
      return validator.matches(value, /^(19|20)[0-9]{2}[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$/);
    },
    message: 'Must be formatted as 1900-01-01 and between 1900-01-01 and 2099-12-31'
  }
};
validator.extend(rules);
```


Use them with their validator name:
```javascript
nodeValidator.check(req, {
    'query.date': ['isDate']
});
```


### Optional input

You can use the `optional` to check an input only when the input exists.

### methods
based on chriso's [`validator.js`](https://github.com/chriso/validator.js), but improve it by compare type

- **equals(str, comparison)** - check if the string matches the comparison.
- **contains(str, seed)** - check if the string contains the seed.
- **matches(str, pattern [, modifiers])** - check if string matches the pattern. Either `matches('foo', /foo/i)` or `matches('foo', 'foo', 'i')`.
- **isEmail(str)** - check if the string is an email.
- **isURL(str [, options])** - check if the string is an URL. `options` is an object which defaults to `{ protocols: ['http','https','ftp'], require_tld: true, require_protocol: false, allow_underscores: false, host_whitelist: false, host_blacklist: false, allow_trailing_dot: false }`.
- **isFQDN(str [, options])** - check if the string is a fully qualified domain name (e.g. domain.com). `options` is an object which defaults to `{ require_tld: true, allow_underscores: false, allow_trailing_dot: false }`.
- **isIP(str [, version])** - check if the string is an IP (version 4 or 6).
- **isAlpha(str)** - check if the string contains only letters (a-zA-Z).
- **isNumeric(str)** - check if the string contains only numbers.
- **isAlphanumeric(str)** - check if the string contains only letters and numbers.
- **isBase64(str)** - check if a string is base64 encoded.
- **isHexadecimal(str)** - check if the string is a hexadecimal number.
- **isHexColor(str)** - check if the string is a hexadecimal color.
- **isLowercase(str)** - check if the string is lowercase.
- **isUppercase(str)** - check if the string is uppercase.
- **isInt(str)** - check if the string is an integer.
- **isFloat(str)** - check if the string is a float.
- **isDivisibleBy(str, number)** - check if the string is a number that's divisible by another.
- **isNull(str)** - check if the string is null.
- **isLength(str, min [, max])** - check if the string's length falls in a range. Note: this function takes into account surrogate pairs.
- **isByteLength(str, min [, max])** - check if the string's length (in bytes) falls in a range.
- **isUUID(str [, version])** - check if the string is a UUID (version 3, 4 or 5).
- **isDate(str)** - check if the string is a date.
- **isAfter(str [, date])** - check if the string is a date that's after the specified date (defaults to now).
- **isBefore(str [, date])** - check if the string is a date that's before the specified date.
- **isIn(str, values)** - check if the value is in a array of allowed values.
- **isCreditCard(str)** - check if the string is a credit card.
- **isISBN(str [, version])** - check if the string is an ISBN (version 10 or 13).
- **isMobilePhone(str, [, locale])** - check if the string is a mobile phone number, (locale should be locales, like 'zh-CN', currently only support 'zh-CN').
- **isJSON(str)** - check if the string is valid JSON (note: uses JSON.parse).
- **isMultibyte(str)** - check if the string contains one or more multibyte chars.
- **isAscii(str)** - check if the string contains ASCII chars only.
- **isFullWidth(str)** - check if the string contains any full-width chars.
- **isHalfWidth(str)** - check if the string contains any half-width chars.
- **isVariableWidth(str)** - check if the string contains a mixture of full and half-width chars.
- **isSurrogatePair(str)** - check if the string contains any surrogate pairs chars.
- **isNotEmptyString**: 'Value must be a string and not be empty string',
- **isMd5**: 'Value must be a valid md5',
- **isMacAddress**: 'Value must be a valid mac address',
- **exists**: 'Value not exists',
- **isUndefinedOrNull**: 'Value must be undefined or null',
- **isTypArray**
- **isTypObject**
- **isTypString**
- **isTypDate**
- **isTypRegExp**
- **isTypFunction**
- **isTypBoolean**
- **isTypNumber**
- **isTypeNull**
- **isTypeUndefined**

## License

Copyright (c) 2014 Arthur Zhang <zhangya_no1@qq.com>, MIT License
