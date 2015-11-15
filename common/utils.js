/**
 * Created by athakwani on 11/12/14.
 */

var utils = require("util");

module.exports = {

  findMinMax: function (dict) {
    // There's no real number bigger than plus Infinity
    var lowest = Number.POSITIVE_INFINITY;
    var highest = Number.NEGATIVE_INFINITY;
    var tmp;
    for (var key in dict) {
      tmp = dict[key].totalcount;
      if (tmp < lowest) lowest = tmp;
      if (tmp > highest) highest = tmp;
    }

    return {'min': lowest, 'max': highest};
  },

  isFunction: function (fn) {
    return typeof fn == 'function';
  },

  isFloat: function (n) {
    return n === +n && n !== (n | 0);
  },

  isInteger: function (n) {
    return n === +n && n === (n | 0);
  },

  mergeObjs: function (tar, src) {
    if (typeof src == 'undefined') {
      return tar;
    } else if (typeof tar == 'undefined') {
      return src;
    }

    for (var prop in src) {
      // if its an object
      if (src[prop] != null && this.isFunction(src[prop])) {
        // Do nothing.
        continue;
      }
      else if (src[prop] != null && src[prop].constructor == Object) {
        tar[prop] = this.mergeObjs(tar[prop], src[prop]);
      }
      // if its an array, simple values need to be joined.  Object values need to be remerged.
      else if (src[prop] != null && utils.isArray(src[prop]) && src[prop].length > 0) {
        tar[prop] = tar[prop].concat(src[prop]);
      }
      else {
        tar[prop] = src[prop];
      }
    }
    return tar;
  }
};