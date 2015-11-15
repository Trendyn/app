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
var findUserbyEmailSP          = "CALL FindUserbyemail          ('%s');";
var findUserbyIDSP             = "CALL FindUserbyID             (%d);";
var addUserSP                  = "CALL AddUser                  ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s');";
var facebookAddUserSP          = "CALL AddFacebookUser          ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', " +
                                                                "'%s',  '%s', '%s', '%s', '%s');";
var facebookFindUserSP         = "CALL FindFacebookUser         ('%s');";
var twitterAddUserSP           = "CALL AddTwitterUser           ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', " +
                                                                "'%s', '%s');";
var twitterFindUserSP          = "CALL FindTwitterUser          ('%s');";
var storeInvitationSP          = "CALL StoreInvitation          ('%s', '%s', %d);";
var updateInvitationSP         = "CALL UpdateInvitation         ('%s', '%s', %d);";
var retriveInvitationByEmailSP = "CALL RetriveInvitationByEmail ('%s');";
var retriveInvitationByIdSP    = "CALL RetriveInvitationById    ('%s');";


var User = {

  /*=====================================================
   *   Local user Find by ID stored procedure call
   * ===================================================*/
  findByID : function(id, callback) {
    var query = util.format(findUserbyIDSP, id);
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
  },

  /*=====================================================
   *   Local user Find by email stored procedure call
   * ===================================================*/
  findByEmail : function(email, callback) {
    var query = util.format(findUserbyEmailSP, email);
    console.log(query);
    db.getConnection(
                     ok(callback, function(conn) {
                       conn.query(query,
                                  ok(callback, function(rows) {
                                    conn.release();
                                    return callback(null, rows[0][0]);
                                  })
                       );
                     })
    );
  },

  /*=====================================================
   *    Local add user stored procedure call
   * ===================================================*/
  addUser: function(email,
                    password,
                    name,
                    usrImgURL,
                    gender,
                    dob,
                    lat,
                    lng,
                    callback) {

    var query = util.format(addUserSP,
                            email,
                            password,
                            name,
                            usrImgURL,
                            gender,
                            dob,
                            lat,
                            lng);
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
  },

  /*=====================================================
   *    Facebook Find by ID stored procedure call
   * ===================================================*/
  facebookFindByID : function(id, callback) {
    var query = util.format(facebookFindUserSP, id);
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
  },

  /*=====================================================
   *    Facebook Add user stored procedure call
   * ===================================================*/
  facebookAddUser : function(profile, callback) {
    var usrImgURL = "https://graph.facebook.com/" + profile.emails[0].value.split('@')[0] + "/picture";

    var query = util.format(facebookAddUserSP,
                            profile.id,
                            profile.emails[0].value,
                            'abc', //TODO: Hardcoded password, refactor later
                            profile._json.first_name,
                            profile._json.last_name,
                            profile.profileUrl,
                            usrImgURL,
                            profile._json.gender,
                            profile._json.hometown.name,
                            profile._json.location.name,
                            profile._json.birthday,
                            '10',
                            '10' //TODO: Harcoded latlang, refactor later.
                            );
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
  },

  /*=====================================================
   *         Facebook Find or Create Logic.
   * ===================================================*/
  facebookFindOrCreate : function(profile, callback) {
    console.log(profile);

    var obj = this;
    obj.facebookFindByID(profile.id,
                         ok(callback, function(user) {
                           if (user == undefined)
                             return obj.facebookAddUser(profile, callback);

                           return callback(null, user);
                         })
    );
  },


  /*=====================================================
   *    Twitter Find by ID stored procedure call
   * ===================================================*/
  twitterFindByID : function(id, callback) {
    var query = util.format(twitterFindUserSP, id);
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
  },

  /*=====================================================
   *    Twitter Add user stored procedure call
   * ===================================================*/
  twitterAddUser : function(profile, callback) {

    var query = util.format(twitterAddUserSP,
      profile.id,
      profile.username,
      'abc',    //TODO: Hardcoded password, refactor later
      profile._json.name,
      profile.photos[0].value,
      '',   //TODO: Harcoded latlang, obtain from user for twitter login.
      profile._json.location,
      '',       //TODO: Harcoded latlang, obtain from user for twitter login
      '10',
      '10' //TODO: Harcoded latlang, refactor later.
    );
    console.log(query);
    db.getConnection(
                     ok(callback, function(conn) {
                       conn.query(query,
                                 ok(calback, function (rows) {
                                   conn.release();
                                   return callback(null, rows[0][0]);
                                 })
                       );
                     })
    );
  },

  /*=====================================================
   *         Twitter Find or Create Logic.
   * ===================================================*/
  twitterFindOrCreate : function(profile, callback) {
    console.log(profile);
    var obj = this;
    obj.twitterFindByID(profile.id,
                        ok(callback, function (user) {
                          if (user == undefined)
                            return obj.twitterAddUser(profile, callback);

                          return callback(null, user);
                        })
    );
  },

  /*=====================================================
   *             Store Invitation
   * ===================================================*/
  storeInvitation : function (email, inviteID, active, callback) {
    var query = util.format(storeInvitationSP,
                            email,
                            inviteID,
                            active);
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
  },

  /*=====================================================
   *             Update Invitation
   * ===================================================*/
  updateInvitation : function (email, inviteID, active, callback) {
    var query = util.format(updateInvitationSP,
      email,
      inviteID,
      active);
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
  },

  /*=====================================================
   *      Retrive Invitation information by email.
   * ===================================================*/
  retriveInvitationByEmail : function(email, callback) {
    var query = util.format(retriveInvitationByEmailSP, email);
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
  },

  /*=====================================================
   *      Retrive Invitation information by ID.
   * ===================================================*/
  retriveInvitationById : function(id, callback) {
    var query = util.format(retriveInvitationByIdSP, id);
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
  /*=====================================================
   *       Add route for User object..
   * ===================================================*/
  app.get('/user',
    function(req, res, next) {
      User.findByID(req.session.passport.user.id,
        ok(next, function (user) {
          if (!user) {
            req.session.messages =  [info.message];
            return res.redirect("/login");
          }
          return res.send(user);
        }));
    }
  );
}

module.exports = User;
module.exports.init = init;
module.exports.installRoutes = installRoutes;
