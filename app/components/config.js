var app = require("angular").module("ocApp");

app.constant("ocMapConfigVal", {
	"userurl": "/user",
	"polldataurl": "/getpolls",
	"reverseGeoCoderUrl": "/reversegeolookup/:lat/:lon"
});