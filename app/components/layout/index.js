/**
 * Created by athakwani on 10/15/14.
 */

require("../poll");
require("../user");

var app = require("angular").module("ocApp");

app.controller("ocLayoutCtrl", ["$scope",
                                "$rootScope",
                                "pollsdata",
                                "user",
                                require("./layoutcontroller.js")]);
