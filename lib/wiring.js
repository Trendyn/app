/**
 * Express server routes,
 * Registers routes.
 * @author opinioncurrent.com
 */
'use strict';

/*=====================================================
 *       Include required express components.
 * ===================================================*/
var Authentication  = require('./controllers/authentication');
var User            = require('./controllers/user');
var Login           = require('./controllers/login');
var config          = require('./config/config');
var Invite          = require('./controllers/invite');
var Render          = require('./controllers/render');
var RemoteErrors    = require('./controllers/remoteErrors');
var geocoder        = require('./controllers/geocoder');
var ok              = require('okay');
var Poll            = require('./controllers/poll');
var iso3166         = require('./controllers/iso3166');
var sessionMgr      = require('./controllers/sessionmgr');

module.exports = function(app, express) {

  /*=====================================================
   *           Install Render Middleware.
   *  Render middleware serves static contents.
   * ===================================================*/
  Render.init(app);
  Render.installRoutes(app, express, Authentication.ensureAuthenticated);

  /*=====================================================
   *       Install routes for Invite module.
   * ===================================================*/
  Invite.init();
  Invite.installRoutes(app, Authentication.ensureAuthenticated);


  /*=====================================================
   *  Install routes for Remote Errors logging module.
   * ===================================================*/
  RemoteErrors.init();
  RemoteErrors.installRoutes(app, Authentication.ensureAuthenticated);

  /*=====================================================
   *           Install Session Middleware.
   *  Note - Session middleware should be added after
   *  static middleware to avoid creating sessions
   *  for static contents.
   * ===================================================*/
  sessionMgr.init(app, config);

  /*=====================================================
   *        Initialize authentication module.
   * ===================================================*/
  Authentication.init(app, config);

  /*=====================================================
   *       Install routes for User module.
   * ===================================================*/
  User.init();
  User.installRoutes(app);

  /*=====================================================
   *       Install routes for login module.
   * ===================================================*/
  Login.init();
  Login.installRoutes(app, config, Authentication.passport, Authentication.ensureAuthenticated);

  /*=====================================================
   *       Install routes for Authentication module.
   * ===================================================*/
  Authentication.installRoutes(app, config, Invite);

  /*=====================================================
   *       Install routes for Poll module.
   * ===================================================*/
  Poll.init();
  Poll.installRoutes(app, Authentication.ensureAuthenticated);

  /*=====================================================
   *       Install routes for GeoCoder module.
   * ===================================================*/
  geocoder.init();
  geocoder.installRoutes(app);

  /*=====================================================
   *   Install routes for Reverse lookup module.
   * ===================================================*/
  iso3166.init();
  iso3166.installRoutes(app);


  /*=====================================================
   *  Dev only crash simulator,
   *  TODO: remove from production.
   * ===================================================*/
  app.get('/crash',
    function () {
      throw new Error();
    }
  );

  /*=====================================================
   *  Re-direct to '/404.html' if any of non existent
   *  files are requested.
   * ===================================================*/
  app.get('/*', Authentication.ensureAuthenticated,
    function(req, res) {
      return res.sendFile(config.directory + '/public/404.html',
        {
          root: __dirname + '/../'
        });
    }
  );

};
