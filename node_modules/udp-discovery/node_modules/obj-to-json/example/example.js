'use strict';
//var objToJson = require('obj-to-json');
var objToJson = require('../index');
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

