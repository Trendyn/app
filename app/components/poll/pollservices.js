/**
 * Poll Services,
 * Services to support opinions Poll.
 * @author opinioncurrent.com
 */
"use strict";

module.exports = {
  pollFactory: function ($resource, ocMapConfigVal) {
    return $resource(ocMapConfigVal.polldataurl);
  },

  pollsLoaderFactory: function (Poll, $q) {
    return function () {
      var delay = $q.defer();
      Poll.query(function (pollsdata) {
        delay.resolve(pollsdata);
      }, function () {
        delay.reject("Unable to fetch poll data");
      });
      return delay.promise;
    };
  }
};

