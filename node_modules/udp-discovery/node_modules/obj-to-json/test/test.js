'use strict';
var assert = require('assert');
var mod = require('../index');

describe('copyObj', function() {
  it('Should return false with no arguments', function() {
    assert.equal(false, mod.copyObj());
  });
  it('Should return equivalent value with non-obj argument', function() {
    assert.equal('55', mod.copyObj(55));
    assert.equal('Hi', mod.copyObj('Hi'));
  });
  it('Should return false with invalid arguments', function() {
    assert.equal(false, mod.copyObj(undefined));
    assert.equal(false, mod.copyObj(function() { return true;}));
  });
  it('Should return false on objects with circular refs.', function() {
    var obj2 = { a: 11, b: true, c: 'hi' };
    obj2.d = { a: obj2 };
    assert.equal(false, mod.copyObj(obj2));
  });
  it('Should return true on valid objects and values.', function() {
    assert.deepEqual({a:11, b:true, c:'hi'}, mod.copyObj({a:11, b:true, c:'hi'}));
    assert.equal(false, mod.copyObj(false));
    assert.deepEqual([], mod.copyObj([]));
    assert.equal('22', mod.copyObj(22));
  });
});

describe('jsonParse', function() {
  it('Should return false with no arguments', function() {
    assert.equal(false, mod.jsonParse());
  });
  it('Should return false with non-str argument', function() {
    assert.equal(false, mod.jsonParse(55));
    assert.equal(false, mod.jsonParse(undefined));
    assert.equal(false, mod.jsonParse(null));
    assert.equal(false, mod.jsonParse(false));
    assert.equal(false, mod.jsonParse([1,2,3,4]));
    assert.equal(false, mod.jsonParse({}));
  });
  it('Should return false with invalid JSON argument', function() {
    assert.equal(false, mod.jsonParse('{a:a}'));
    assert.equal(false, mod.jsonParse('{"a":a}'));
  });
  it('Should return valid object with valid JSON string', function() {
    assert.deepEqual({a:false}, mod.jsonParse('{"a":false}'));
    assert.deepEqual({a:1}, mod.jsonParse('{"a":1}'));
  });
  it('Should support a reviver', function() {
    assert.deepEqual({a:false}, mod.jsonParse('{"a":false}'));
    var reviver = function(k, v) {
      if (k === '') return v;
      return v*2;
    };
    assert.deepEqual({a:2}, mod.jsonParse('{"a":1}', reviver));
  });
});


describe('jsonStringify', function() {
  it('Should return false with no arguments', function() {
    assert.equal(false, mod.jsonStringify());
  });
  it('Should return false with invalid JSON argument', function() {
    assert.equal(undefined, mod.jsonStringify(undefined));
    assert.equal(undefined, mod.jsonStringify(function() {return true;}));
  });
  it('Should return false on objects with circular refs.', function() {
    var obj2 = { a: 11, b: true, c: 'hi' };
    obj2.d = { a: obj2 };
    assert.equal(false, mod.jsonStringify(obj2));
  });
  it('Should return true on valid objects and values.', function() {
    assert.deepEqual('{"a":11,"b":true,"c":"hi"}',
                     mod.jsonStringify({a:11, b:true, c:'hi'}));
    assert.equal('false', mod.jsonStringify(false));
    assert.equal('[]', mod.jsonStringify([]));
    assert.equal('22', mod.jsonStringify(22));
  });
  it('Should support a space', function() {
    assert.deepEqual('{\n "a": 11,\n "b": true,\n "c": "hi"\n}',
                  mod.jsonStringify({a:11, b:true, c:'hi'}, null, ' '));
  });
  it('Should support a replacer', function() {
    var replacer = function(k, v) {
      if (k === 'a')  return v*2;
      return v;
    };
    assert.deepEqual('{"a":22,"b":true,"c":"hi"}',
                  mod.jsonStringify({a:11, b:true, c:'hi'}, replacer));
  });
  it('Should support a replacer & space', function() {
    var replacer = function(k, v) {
      if (k === 'a')  return v*3;
      return v;
    };
    assert.deepEqual('{\n "a": 33,\n "b": true,\n "c": "hi"\n}',
               mod.jsonStringify({a:11, b:true, c:'hi'}, replacer, ' '));
  });
});
