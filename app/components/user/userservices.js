/**
 * User Services,
 * User Services to support opinions Poll.
 * @author opinioncurrent.com
 */
"use strict";

module.exports = {
  userFactory: function ($resource, ocMapConfigVal) {
    return $resource(ocMapConfigVal.userurl, "", {
      "get": {
        method: "GET",
        cache: true
      }
    });
  },


  userLoaderFactory: function (User, $q) {
    return function () {
      var delay = $q.defer();
      User.get(function (user) {
        delay.resolve(user);
      }, function () {
        delay.reject("Unable to fetch user");
      });
      return delay.promise;
    };
  },

  geoLocationFactory: function ($resource, ocMapConfigVal) {
    return $resource(ocMapConfigVal.reverseGeoCoderUrl,
      {lat: "@lat", lon: "@lon"}, {
        "get": {
          method: "GET",
          cache: true
        }
      });
  },

  userLocationLoaderFactory: function (UserLoader, GeoLocation, $q) {
    return function () {
      var delay = $q.defer();
      new UserLoader().then(function(user) {
          GeoLocation.get({lat: user.lat, lon: user.lng}, function (location) {
          user.location = location;
          delay.resolve(user);
        }, function () {
          delay.reject("Unable to fetch user location");
        });
      });
    return delay.promise;
    };

  }


};