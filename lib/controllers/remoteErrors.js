/**
 * Created by athakwani on 10/26/14.
 */

function init() {

}

function installRoutes(app, ensureAuthenticated) {
  app.post('/javascript-errors', ensureAuthenticated,
    function (req, res) {
      console.log("========= Client Error Start =========");
      console.log("Session:" + req.session.id + " User ID: " + req.session.passport.user);
      console.log(req.body.errorUrl + " : " + req.body.errorMessage);
      console.log(req.body.stackTrace);
      console.log("========= Client Error End =========");
    }
  );
}

module.exports.init = init;
module.exports.installRoutes = installRoutes;
