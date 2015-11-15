/**
 * Created by athakwani on 10/15/14.
 */
var app = require("angular").module("ocApp");

app.factory("User",       ["$resource",
                           "ocMapConfigVal",
                           require("./userservices.js").userFactory]);
app.factory("UserLoader", ["User",
                           "$q",
                           require("./userservices.js").userLoaderFactory]);
app.factory("geoLocation",       ["$resource",
                                   "ocMapConfigVal",
                                   require("./userservices.js").geoLocationFactory]);
app.factory("UserLocationLoader", ["UserLoader",
                                   "geoLocation",
                                   "$q",
                                  require("./userservices.js").userLocationLoaderFactory]);
