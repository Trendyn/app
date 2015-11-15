/**
 * Created by athakwani on 10/26/14.
 */

var iso3166 = require('iso-3166-2');

function init() {

}

function installRoutes(app) {
  app.get('/iso3166/country/:countryName',
    function(req, res, next) {
      var result = iso3166.country(req.params.countryName);
      res.send(result);
    }
  );

  app.get('/iso3166/subdivision/:countryCode/:region',
    function(req, res, next) {
      var result = iso3166.subdivision(req.params.countryCode, req.params.region);
      res.send(result);
    }
  );

}

module.exports.init = init;
module.exports.installRoutes = installRoutes;