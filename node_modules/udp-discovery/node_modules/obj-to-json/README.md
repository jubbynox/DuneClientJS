obj-to-json
===========

Methods to copy objects and convert JSON to obj and vice-versa in Node.js
without throwing.

Why?

I don't like exceptions. This module wraps the JSON.stringify and JSON.parse,
with a try/catch that makes exceptions become a return value of `false` on
errors. This module is nice if you don't want to deal with exceptions and awful
if you do.

The copyObj function does JSON.parse(JSON.stringify()) and won't work with
objects properties lacking JSON representations or objects having circular
references.

## Installation

    npm install obj-to-json

## Example

    'use strict';
    var objToJson = require('obj-to-json');
    var assert = require('assert');

    // create a copy of the object
    assert.deepEqual({a:11, b:true, c:'hi'}, objToJson.copyObj({a:11, b:true, c:'hi'}));

    // will return false and ot throw
    assert.equal(false, objToJson.copyObj(undefined));

    // a straight-forward parse of the object
    assert.deepEqual({a:1}, objToJson.jsonParse('{"a":1}'));

    // will return false and not throw
    assert.equal(false, objToJson.jsonParse('{a:a}'));

    // a reviver which modifies each key to have 2x the value.
    var reviver = function(k, v) {
      if (k === '') return v;
      return v*2;
    };
    // convert to an object with a reviver.
    assert.deepEqual({a:2}, objToJson.jsonParse('{"a":1}', reviver));

    // a replacer that modifies every 'a' property
    var replacer = function(k, v) {
      if (k === 'a')  return v*3;
      return v;
    };

    // stringify the object using a space and a replacer
    assert.deepEqual('{\n "a": 33,\n "b": true,\n "c": "hi"\n}',
            objToJson.jsonStringify({a:11, b:true, c:'hi'}, replacer, ' '));

    // will return false and not throw
    var obj2 = { a: 11, b: true, c: 'hi' };
    obj2.d = { a: obj2 };
    assert.equal(false, objToJson.jsonStringify(obj2));

    console.log('success.');

## API
### copyObj(val [, delProps])
A convenience function to copy an object. Must be an object that can be
serialized into JSON.

#### Params:
* **Any** *val* Any type with a valid JSON representation.
* **Array|Str** *[delProps]* A string or an array of properties to delete. Optional.
#### Return:
* **Object|Boolean** returns the object copy or false, if there was an error.

### jsonParse(str, [reviver])
A convenience function to convert a JSON string to an object.

#### Params:
* **String** *str* A stringified JSON representation.
* **Function** *[reviver]* Optional function to transform the JSON should have the form: function(key, value)
#### Return:
* **Object|Boolean** returns the object representation of the JSON, if the string representation is legal and false otherwise.

### jsonStringify(val, [replacer], [space])
A convenience function to convert an object to a JSON string.

#### Params:
* **Any** *val* A javascript value with a legal JSON representation.
* **Function** *[replacer]* Optional function to replace values.
* **String** *[space]* An optional separator used for spacing.
#### Return:
* **String|Boolean** The JSON string if possible and false otherwise.

## License
The MIT License (MIT)

Copyright (c) 201,2014 Edmond Meinfelder

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

