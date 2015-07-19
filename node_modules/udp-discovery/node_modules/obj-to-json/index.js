'use strict';
var debug = require('debug')('obj-to-json');
var is = require('is2');
var inspect = require('util').inspect;

/**
 * A convenience function to copy an object. Must be an object that can be
 * serialized into JSON.
 * @param {Any} val Any type with a valid JSON representation.
 * @param {Array|Str} [delProps] A string or an array of properties to delete. Optional.
 * @return {Object|Boolean} returns the object copy or false, if there was an error.
 */
exports.copyObj = function copyObj(obj, delProps) {
  var newObj;
  try {
    newObj = JSON.parse(JSON.stringify(obj));
  } catch(err) {
    debug('copyObj error: '+err.message);
    return false;
  }

  // remove unwanted object properties.
  if (delProps) {
    if (is.str(delProps) && newObj[delProps]) {
      delete newObj[delProps];
    } else if (is.array(delProps)) {
      for (var i=0; i<delProps.length; i++) {
        delete newObj[i];
      }
    }
  }
  return newObj;
};

/**
 * A convenience function to convert a JSON string to an object.
 * @param {String} str A stringified JSON representation.
 * @param {Function} [reviver] Optional function to transform the JSON should have the form: function(key, value)
 * @return {Object|Boolean} returns the object representation of the JSON, if the str representation is is legal and false otherwise.
 */
exports.jsonParse = function jsonParse(str) {
  if (!is.str(str)) {
    debug('jsonParse received bad str param: '+inspect(str));
    return false;
  }

  var reviver;
  if (arguments.length > 1 && is.func(arguments[1]))
    reviver = arguments[1];

  var obj;
  try {
    obj = JSON.parse(str, reviver);
  } catch(err) {
    debug('jsonParse error: '+err.message);
    return false;
  }
  return obj;
};

/**
 * A convenience function to convert an object to a JSON string.
 * @param {Any} val A javascript value with a legal JSON representation.
 * @param {Function} [replacer] Optional function to replace values.
 * @param {String} [space] An optional separator used for spacing.
 * @return {String|Boolean} The JSON string if possible and false otherwise.
 */
exports.jsonStringify = function jsonStringify(val) {
  if (arguments.length < 1) {
    debug('jsonStringify received 0 arguments');
    return false;
  }

  var replacer;
  if (arguments.length > 1 && is.func(arguments[1]))
    replacer = arguments[1];

  var space;
  if (arguments.length > 2 && is.str(arguments[2]))
    space = arguments[2];

  var str;
  try {
    str = JSON.stringify(val, replacer, space);
  } catch(err) {
    debug('jsonStringify error: '+err.message);
    return false;
  }
  return str;
};

