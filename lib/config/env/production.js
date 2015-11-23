'use strict';

module.exports = {
  name: "opynios",
  env: 'production',
  ip:   process.env.OPENSHIFT_NODEJS_IP ||
        process.env.IP ||
        '0.0.0.0',
  port: process.env.OPENSHIFT_NODEJS_PORT ||
        process.env.PORT ||
        80,
  directory: './build',
  cache: true,

  /* Facebook Application configuration */
  facebook_app_id: '1495719323998014',
  facebook_app_secret: '4300b3adcbf683372cfd479104e4a829',
  facebookLoginCallbackURL: 'http://www.opinioncurrent.com/auth/facebook/callback',
  facebookSignupCallbackURL: 'http://www.opinioncurrent.com/signup/facebook/callback',

  /* Twitter Application configuration */
  twitter_app_id: 'isy2eVZNbPMSbTYbwJbkyMVig',
  twitter_app_secret: 'afNqxmDh4BQICqLtjOk7I8lqz1WCTBI97qmAJKeRFlxf1LKmiR',
  twitterLoginCallbackURL: 'http://www.opinioncurrent.com/auth/twitter/callback',
  twitterSignupCallbackURL: 'http://www.opinioncurrent.com/signup/twitter/callback',

  /* Database configuration*/
  db: "opinions",
  db_user: "oc",
  db_password: "opinions",
  db_host: "mysql",

  /* Redis configuration */
  session_secret: "slajhd98aslnjd09aok3me20idlnmqwd92k3dl2w9",
  session_cookie_maxage: 30 * 24 * 60 * 60 * 1000,
  redis_host: "redis",
  redis_port: "6379",
  redis_prefix: "sess",
  redis_ttl: 30 * 24 * 60 * 60,
  redis_pass: "allowcache",
  favicon: "build/public/favicon/favicon-16x16.png",

  /* Logger configuration */
  logstash_server: "logger",
  logstash_port: 9998

};
