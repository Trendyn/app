"use strict";

(function() {
  var angular = require("angular");
  require("angular-route");
  require("angular-resource");

  var ocApp = angular.module("ocApp", [
    /* Angular Modules */
    "ngRoute",
    "ngResource"
  ]);

  require("./config.js");
  require("./layout");

  ocApp.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
      .when("/", {
        controller: "ocLayoutCtrl",
        resolve: {
          pollsdata: ["PollsLoader", function (PollsLoader) {
            return new PollsLoader();
          }],
          user: ["UserLocationLoader", function (UserLocationLoader) {
            return new UserLocationLoader();
          }]
        },
        templateUrl: "./components/layout/layout.html"
      })
      .otherwise({
        redirectTo: "/"
      });
  }]);
})();
