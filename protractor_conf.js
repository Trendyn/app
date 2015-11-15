var HtmlReporter = require('protractor-html-screenshot-reporter');

// An example configuration file.
exports.config = {
  //seleniumAddress: 'http://0.0.0.0:4444/wd/hub',

  // Do not start a Selenium Standalone sever - only run this using chrome.
  //chromeOnly: true,
  //chromeDriver: './node_modules/protractor/selenium/chromedriver',

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    //'browserName': 'chrome'
    //'browserName': 'firefox'

    'browserName': 'phantomjs',
    'phantomjs.binary.path':'./node_modules/phantomjs/bin/phantomjs'
  },

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: [
   'test/e2e/loginSpec.js',
   'test/e2e/*.js'
  ],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  },

  onPrepare: function() {
    //require('jasmine-reporters');

    browser.driver.manage().window().maximize();
    //browser.driver.manage().window().setSize(1280, 776);

    //Captures screen shots. Currently enabled only for failure cases
    jasmine.getEnv().addReporter(new HtmlReporter({
      baseDirectory: '/tmp/screenshots',
      takeScreenShotsOnlyForFailedSpecs: true
    }));

  },

  baseUrl: 'http://localhost/'
};
