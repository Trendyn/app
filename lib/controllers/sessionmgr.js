/**
 * Created by athakwani on 10/26/14.
 */

var session        = require('express-session');
var RedisStore     = require('connect-redis')(session);

function init(app, config) {

  var options = {
    host: config.redis_host,
    port: config.redis_port,
    prefix: config.redis_prefix,
    ttl: config.redis_ttl,
    pass: config.redis_pass 
  };

  /*=====================================================
   *            Add Session middleware.
   * ===================================================*/
  app.use(session({
      secret: config.session_secret,
      cookie : {
        maxAge: config.session_cookie_maxage
      },
      store: new RedisStore(options),
      saveUninitialized: false,
      resave: false
    })
  );

}

module.exports.init = init;
