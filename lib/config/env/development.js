'use strict';

module.exports = {
  name: "opynios",
  env: 'development',
  directory: './app',
  cache: false,

  /* Facebook Application configuration */
  facebook_app_id: '681894935198165',
  facebook_app_secret: 'b01abf6e00cf6fbd642c73bf50b8ba42',
  facebookLoginCallbackURL: 'http://localhost:9000/auth/facebook/callback',
  facebookSignupCallbackURL: 'http://localhost:9000/signup/facebook/callback',

  /* Twitter Application configuration */
  twitter_app_id: 'PSlVlOwsSkuSnqgdzLmFohp6J',
  twitter_app_secret: 'l8kn8EyXNpqC8SpEsOO8wLWX4VC8konSCUOozHbWqsDW1oIogN',
  twitterLoginCallbackURL: 'http://localhost:9000/auth/twitter/callback',
  twitterSignupCallbackURL: 'http://localhost:9000/signup/twitter/callback',

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

  favicon: "app/public/favicon/favicon-16x16.png",

  /* Logger configuration */
  logstash_server: "logger",
  logstash_port: 9998

};
