  /**
 * Express server authentication module,
 * Defines authentication strategies using passportjs.
 * @author opinioncurrent.com
 */

'use strict';

/*=====================================================
 *       Include required express components.
 * ===================================================*/
var passport         = require('passport');
var localstrategy    = require('passport-local').Strategy;
var facebookStrategy = require('passport-facebook').Strategy;
var twitterStrategy  = require('passport-twitter').Strategy;
var User             = require('./user');
var invite           = require('./invite');
var ok               = require("okay");


/*=========================================================================================
 *  Module init function, defines strategies for local, facebook, twitter, google+ login
 * ======================================================================================*/
function init(app, config) {
  app.use(passport.initialize());
  app.use(passport.session());

  /*=====================================================
   *       Define Passportjs local login strategy.
   * ===================================================*/
  passport.use('local-login', new localstrategy( {
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true
    },
    function(req, email, password, done) {

      User.findByEmail(email,
                       ok(done, function (user) {
                         console.log(user);

                         if (!user)
                           return done(err, false, { message: 'Incorrect username.' });
                         else if (!(user.password == password))
                           return done(err, false, { message: 'Incorrect password.' });

                         return done(null, user);
      }));
    }
  ));

  /*=====================================================
   *       Define Passportjs facebook login strategy.
   * ===================================================*/
  var fbLoginStrategy = new facebookStrategy({
      clientID: config.facebook_app_id,
      clientSecret: config.facebook_app_secret,
      callbackURL: config.facebookLoginCallbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      User.facebookFindByID(profile.id,
                            ok(done, function(user) {
                              done(null, user);
                            })
      );
    });

  fbLoginStrategy.name = "facebook-login";
  passport.use(fbLoginStrategy);

  /*=====================================================
   *    Define Passportjs facebook Signup strategy.
   * ===================================================*/
  var fbSignupStrategy = new facebookStrategy({
      clientID: config.facebook_app_id,
      clientSecret: config.facebook_app_secret,
      callbackURL: config.facebookSignupCallbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      User.facebookFindOrCreate(profile,
                                ok(done, function(user) {
                                  done(null, user);
                                })
      );
    });

  fbSignupStrategy.name = "facebook-signup";

  passport.use(fbSignupStrategy);

  /*=====================================================
   *       Define Passportjs twitter login strategy.
   * ===================================================*/
  var twitterLoginStretegy = new twitterStrategy({
      consumerKey:    config.twitter_app_id,
      consumerSecret: config.twitter_app_secret,
      callbackURL:    config.twitterLoginCallbackURL
    },
    function(token, tokenSecret, profile, done) {
      User.twitterFindByID(profile.id,
                           ok(done, function(user) {
                             done(null, user);
                           })
      );
    });

  twitterLoginStretegy.name = "twitter-login";
  passport.use(twitterLoginStretegy);

  /*=====================================================
   *   Define Passportjs twitter Signup strategy.
   * ===================================================*/
  var twitterSingupStretegy = new twitterStrategy({
      consumerKey:    config.twitter_app_id,
      consumerSecret: config.twitter_app_secret,
      callbackURL:    config.twitterSignupCallbackURL
    },
    function(token, tokenSecret, profile, done) {
      User.twitterFindOrCreate(profile,
                               ok(done, function(user) {
                                 done(null, user);
                               })
      );
    });

  twitterSingupStretegy.name = "twitter-signup";
  passport.use(twitterSingupStretegy);


  /*=====================================================
   *       Required passportJS function.
   * ===================================================*/

  passport.serializeUser(function(user, done) {
    var sessionUser = { _id: user._id, id: user.id, name: user.name, email: user.email};
    done(null, sessionUser);
  });

  passport.deserializeUser(function(sessionUser, done) {
    done(null, sessionUser);
  });
}

/*==========================================================
 *    Function to ensure request is authenticated.
 *    Prepend to any route that needs to be authenticated.
 * ========================================================*/
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.destroy();
  return res.redirect("/login");
}


/*==========================================================
 *    Function to ensure request is authenticated.
 *    Prepend to any route that needs to be authenticated.
 * ========================================================*/
function ensureInvited(req, res, next) {
  invite.verifyInvitation(req.cookies.invite_id,
                          ok(next, function() {
                            return res.redirect('/');
                          })
  );
}

function installRoutes(app, config, invite) {

  /*=====================================================
   *       Include routes for signup.
   * ===================================================*/
  app.get('/signup', ensureInvited,
    function (req, res) {
      res.sendfile(config.directory + '/signup.html');
    }
  );

  app.post('/signup', ensureInvited,
    function (req, res, next) {
      invite.deactivateInvitation(req.cookies.invite_id,
        ok(next, function () {
          var dob = req.body.year + '-' +
            req.body.month + '-' +
            req.body.day;

          return User.addUser(req.body.email,
            req.body.password,
            req.body.name,
            req.body.gender,
            dob,
            "10",
            "10", // TODO: hardcoded latlang, refactor later
            ok(function () {
                invite.activateInvitation(req.cookies.invite_id, req.body.email,
                  ok(next, function () {
                    next();
                  })
                );
              },
              function () {
                return res.redirect('/login');
              })
          );
        }));
    }
  );

  /*=====================================================================================================
   *  Add routes for facebook authentication.
   *  Passport redirect the user to Facebook for authentication.
   *  When complete Facebook will redirect the user back to the
   *  application at /auth/facebook/callback, see authentication.js for Facebook authentication strategy.
   * ====================================================================================================*/

  app.get('/auth/facebook', passport.authenticate('facebook-login', { scope: ['publish_actions',
      'email',
      'public_profile',
      'user_friends',
      'user_birthday',
      'user_hometown',
      'user_location',
      'user_photos',
      'user_relationships'
    ]})
  );

  /*=====================================================================================================
   *  Facebook will redirect the user to this URL after approval.
   *  Finish the authentication process by attempting to obtain an access token.
   *  If access was granted, the user will be logged in.
   *  Otherwise,authentication has failed.
   * ====================================================================================================*/
  app.get('/auth/facebook/callback', passport.authenticate('facebook-login', { successRedirect: '/',
      failureRedirect: '/login'
    })
  );


  app.get('/signup/facebook', passport.authenticate('facebook-signup', { scope: ['publish_actions',
      'email',
      'public_profile',
      'user_friends',
      'user_birthday',
      'user_hometown',
      'user_location',
      'user_photos',
      'user_relationships'
    ]})
  );

  app.get('/signup/facebook/callback', passport.authenticate('facebook-signup', { failureRedirect: '/login' }),
    function (req, res, next) {
      invite.deactivateInvitation(req.cookies.invite_id,
        ok(next, function () {
          res.redirect('/');
        })
      );
    }
  );

  /*=====================================================================================================
   *  Add routes for twitter authentication.
   *  Passport redirect the user to Twitter for authentication.
   *  When complete Twitter will redirect the user back to the
   *  application at /auth/twitter/callback, see authentication.js for Twitter authentication strategy.
   * ====================================================================================================*/

  app.get('/auth/twitter', passport.authenticate('twitter-login'));

  /*=====================================================================================================
   *  Twitter will redirect the user to this URL after approval.
   *  Finish the authentication process by attempting to obtain an access token.
   *  If access was granted, the user will be logged in.
   *  Otherwise,authentication has failed.
   * ====================================================================================================*/
  app.get('/auth/twitter/callback', passport.authenticate('twitter-login', { successRedirect: '/',
      failureRedirect: '/login'
    })
  );

  app.get('/signup/twitter', passport.authenticate('twitter-signup'));

  /*=====================================================================================================
   *  Twitter will redirect the user to this URL after approval.
   *  Finish the authentication process by attempting to obtain an access token.
   *  If access was granted, the user will be logged in.
   *  Otherwise,authentication has failed.
   * ====================================================================================================*/
  app.get('/signup/twitter/callback', passport.authenticate('twitter-signup', { failureRedirect: '/login' }),
    function (req, res, next) {
      invite.deactivateInvitation(req.cookies.invite_id,
        ok(next, function () {
          res.redirect('/');
        })
      );
    }
  );
}

module.exports.passport = passport;
module.exports.ensureAuthenticated = ensureAuthenticated;
module.exports.ensureInvited = ensureInvited;
module.exports.init = init;
module.exports.installRoutes = installRoutes;