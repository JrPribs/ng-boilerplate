exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['test/ui/**/*.spec.js'],
  seleniumServerJar: './node_modules/protractor/node_modules/selenium/selenium-server-standalone-2.39.0.jar',
  capabilities: {
    'browserName': 'phantomjs'
  }
};