/**
 * Main Controller,
 * Controller for single page app.
 * @author opinioncurrent.com
 */
"use strict";

/* Master controller to handle all the polls */
module.exports = function ($scope, $rootScope, pollsdata, user) {
  $scope.pollsdata = pollsdata;
  $rootScope.user = $scope.user = user;

};