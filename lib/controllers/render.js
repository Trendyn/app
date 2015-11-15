/**
 * Created by athakwani on 10/26/14.
 */

var config          = require('../config/config');

function init(app) {

  /*=====================================================
   *             Initialize View Engine.
   * ===================================================*/
  // Set hogan as rendering engine
  app.engine('html', require('hogan-engine'));
  app.set('views', config.directory);
  app.set('view engine', 'html');
  app.set('view cache', config.cache);

}

function installRoutes(app, express, ensureAuthenticated) {

  /*=====================================================
   *      Add static middleware.
   * ===================================================*/
  var client     = config.directory + '/public';
  var components = config.directory + '/components';
  var vendor     = config.directory + '/vendor';
  var maps       = config.directory + '/MAPS';
  var favicon    = config.directory + '/public/favicon';

  app.use("/public",                 express.static(client));
  app.use("/components",             express.static(components));
  app.use("/vendor",                 express.static(vendor));
  app.use("/MAPS",                   express.static(maps));
  app.use("/app/components/favicon", express.static(favicon));

  app.get('/login',
    function(req, res) {
      return res.sendFile(config.directory + '/public/login.html',
        {
          root: __dirname + '/../../'
        });
    }
  );


}

module.exports.init = init;
module.exports.installRoutes = installRoutes;