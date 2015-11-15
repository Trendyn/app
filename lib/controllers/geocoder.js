/**
 * User module,
 * Abstracts User module, provide functions for finding and adding user accounts.
 * Supports local, facebook, twitter, google+ users
 * @author opinioncurrent.com
 */

var util = require('util');
var db   = require('./db');
var ok   = require('okay');

/*=====================================================
 *   MySQL Stored procedure queries.
 * ===================================================*/
var reverseGeoCoder = "CALL ReverseGeoCoder(%d, %d);";

var geocoder = {

  /*=====================================================
   *   Local user Find by ID stored procedure call
   * ===================================================*/
  reverse : function(lat, lon, callback) {
    var query = util.format(reverseGeoCoder, lat, lon);
    console.log(query);
    db.getConnection(
      ok(callback, function(conn) {
        conn.query(query,
          ok(callback, function (rows) {
            conn.release();
            return callback(null, rows[0][0]);
          })
        );
      })
    );
  }
};

function init() {

}

function installRoutes(app) {

  app.get('/reversegeolookup/:lat/:lon',
    function(req, res, next) {
      geocoder.reverse(req.params.lat, req.params.lon,
        ok(next, function(result) {
          res.send(result);
        })
      );
    }
  );
}

module.exports.init = init;
module.exports.installRoutes = installRoutes;