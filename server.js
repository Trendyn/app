/**
 * Express server,
 * Includes required express components and starts listening.
 * @author opinioncurrent.com
 */

'use strict';

var program = require('commander');

program
  .version('0.0.1')
  .option('-s, --start', 'Start server', start)
  .parse(process.argv);

var server;

function start(mode) {
  /*=====================================================
   *    Set default node environment to development.
   * ===================================================*/
  if (mode == "production" || process.env.NODE_ENV == "production")
    process.env.NODE_ENV = "production";
  else
    process.env.NODE_ENV = 'development';

  var config = require('./lib/config/config');

  /*=====================================================
   *       Include required express components.
   * ===================================================*/
  var http              = require('http');
  var fs                = require('fs');
  var express           = require('express');
  var app               = express();
  var errorhandler      = require('errorhandler');
  var responseTime      = require('response-time');
  var bodyParser        = require('body-parser');
  var cookieParser      = require('cookie-parser');
  var methodOverride    = require('express-method-override');
  var domain            = require('express-domain-middleware');
  var favicon           = require('express-favicon');
  var bunyan            = require('bunyan');
  var bunyan_middleware = require('bunyan-middleware');
  var bunyantcp         = require('bunyan-logstash-tcp');

  /*=====================================================
   *                 Add middlewares.
   * ===================================================*/
  app.use(responseTime({digits:5}));
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(methodOverride());
  app.use(favicon(config.favicon));


  /*=====================================================
   *             Logger Middleware
   * ===================================================*/
  var logger = bunyan.createLogger({
    name: config.name,
    streams: [{
      level: 'debug',
      type: "raw",
      stream: bunyantcp.createStream({
        host: config.logstash_server,
        port: config.logstash_port
      })
    }],
    level: 'debug'
  });


   app.use(bunyan_middleware({
     logger: logger
   }));


  /*=====================================================
   *  Initialize domain middleware for error handling..
   * ===================================================*/
  app.use(domain);

  /*=====================================================
   *                Wire Components.
   * ===================================================*/
  var wiring = require('./lib/wiring.js')(app, express);


  /*=====================================================
   *      Add error handler middleware.
   * ===================================================*/
  app.use(function errorHandler(err, req, res, next) {
    console.log('error on request %d %s %s', process.domain.id, req.method, req.url);
    console.log(err.stack);
    res.sendfile(config.directory + '/public/500.html');
    if(err.domain) {
      /* Exit the process gracefull after closing the sockets. */
    }
  });

  process.on('uncaughtException', function (err) {
    console.log(err);
  });

  /*=====================================================
   *      Start listening on configured port.
   * ===================================================*/
  server = http.createServer(app).listen(config.port,
                                         function() {
                                           console.log('Server listening on %s:%d, in %s mode',
                                                       config.ip, config.port, app.get('env'));
                                         }
  );
}

function stop () {
  server.close(function() {
                 console.log('Server stopped.');
               }
  );
}

module.exports.stop = stop;
module.exports.start = start;
