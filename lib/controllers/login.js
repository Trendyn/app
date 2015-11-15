/**
 * Created by athakwani on 10/26/14.
 */

var ok              = require('okay');

function init() {

}

function installRoutes(app, config, passport, ensureAuthenticated) {
  /*=====================================================
   *       Add routes for login.
   * ===================================================*/

  app.post('/login',
    function(req, res, next) {
      passport.authenticate('local-login',
        ok(next, function (user, info) {
          if (!user) {
            return res.redirect("/login");
          }

          req.logIn(user,
            ok(next, function() {
              return res.redirect('/');
            }));
        })
      )(req, res, next);
    });

  /*=====================================================
   *       Include routes for logout.
   * ===================================================*/
  app.get('/logout',
    function(req, res) {
      req.logout();
      req.session.destroy();
      return res.redirect('/login');
    }
  );

  /*=====================================================
   *       Include routes for main page.
   * ===================================================*/
  app.get('/', ensureAuthenticated,
    function(req, res) {
      return res.sendFile(config.directory + '/index.html',
        {
          root: __dirname + '/../../'
        });
    }
  );


}

module.exports.init = init;
module.exports.installRoutes = installRoutes;