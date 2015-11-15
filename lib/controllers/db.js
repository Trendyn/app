/**
 * Created by athakwani on 7/5/14.
 */
'use strict';

var mysql          = require('mysql');
var connection     = null;
var config         = require("../config/config");


var pool  = mysql.createPool({
  host     : config.db_host,
  user     : config.db_user,
  password : config.db_password,
  database : config.db
});


function getConnection (callback) {
  pool.getConnection(callback);
}

module.exports.getConnection = getConnection;