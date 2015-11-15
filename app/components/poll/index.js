/**
 * Created by athakwani on 10/15/14.
 */

var app = require("angular").module("ocApp");

app.factory("Poll" ,         ["$resource", "ocMapConfigVal", require("./pollservices.js").pollFactory]);
app.factory("PollsLoader",   ["Poll", "$q", require("./pollservices.js").pollsLoaderFactory]);
