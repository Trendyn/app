/**
 * Created by athakwani on 7/13/14.
 */
/**
 * Invitation module,
 * This module support sending invitation.
 * @author opinioncurrent.com
 */

'use strict';

var emailjs  = require('./email');
var config   = require("../config/config");
var crypto   = require('crypto');
var user     = require('./user');
var ok       = require('okay');

function encrypt(text){
  var cipher = crypto.createCipher('aes-256-cbc', config.AES_key);
  var crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text){
  var decipher = crypto.createDecipher('aes-256-cbc', config.AES_key);
  var dec = decipher.update(text,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
}

function sendInvitation(name, email, host, callback) {
  user.retriveInvitationByEmail(email,
                                ok(callback, function(user) {

                                  if(user)
                                    return callback(new Error("Invitation already sent for " + email), null);

                                    var inviteID = encrypt(email);

                                    var message = {
                                      from:    "Ashish <ashish@opinioncurrent.com>",
                                      to:      name + " <" + email + ">",
                                      subject: "You're invited. ",
                                      text:    "You are invited to join opinioncurrent.com, please click http://" + host + ":" + config.port +"/invite/" + inviteID  + " to register.",
                                      html:    "<html> You are invited to join opinioncurrent.com, " +
                                              "please click <a href='http://" + host + ":" + config.port + "/invite/" + inviteID + "'>Join</a> to register."
                                    };

                                    emailjs.sendEmail(message,
                                                      ok(callback, function(result) {

                                                        var active = 1;
                                                        user.storeInvitation(email, inviteID, active,
                                                                             ok(callback, function (user) {
                                                                               return callback(null, user);
                                                                             })
                                                        );
                                                      })
                                    );
                                })
  );
}

function verifyInvitation(id, callback) {
  user.retriveInvitationById(id,
                             ok(callback, function(user) {
                               var email = decrypt(id);

                               if (!user || user.email != email)
                                 return callback(new Error("Invitation not found in system."), null);

                               if (!user.active)
                                 return callback(new Error("Invitation expired or used."), null);

                               return callback(null, user);
                             })
  );
}

function deactivateInvitation(id, callback) {
  user.retriveInvitationByEmail(id,
                               ok(callback, function (user) {
                                 if(user)
                                   return callback(new Error("Invitation " + id + "not found"), null);

                                 var email = decrypt(id);
                                 var active = 0;
                                 user.updateInvitation(email, id, active,
                                                       ok(callback, function(user) {
                                                         return callback(null, user);
                                                       })
                                 );
                               })
  );
}

function activateInvitation(id, email, callback) {
  user.retriveInvitationByEmail(id,
                                ok(callback, function(user) {
                                  if(user)
                                    return callback(new Error("Invitation " + id + "not found"), null);

                                  var decrypted_email = decrypt(id);

                                  if (decrypted_email != email)
                                    return callback(new Error("Mismatch between decrypted email & argument email."), null);

                                  var active = 1;
                                  user.updateInvitation(email, id, active,
                                                        ok(callback, function(user) {
                                                          return callback(null, user);
                                                        })
                                  );
                                })
  );
}

function init() {

}

function installRoutes(app, ensureAuthenticated) {
  app.get('/invite/:id',
    function(req, res, next) {
      invite.verifyInvitation(req.params.id,
        ok(next, function() {
          res.cookie('invite_id', req.params.id);
          return res.redirect('/signup');
        })
      );
    }
  );


  app.post('/invite', ensureAuthenticated,
    function(req, res, next) {
      invite.sendInvitation(req.body.name, req.body.email, req.host,
        ok(next, function() {
          return res.send("success");
        })
      );
    }
  );


}

module.exports.sendInvitation       = sendInvitation;
module.exports.verifyInvitation     = verifyInvitation;
module.exports.activateInvitation   = activateInvitation;
module.exports.deactivateInvitation = deactivateInvitation;
module.exports.init                 = init;
module.exports.installRoutes        = installRoutes;


