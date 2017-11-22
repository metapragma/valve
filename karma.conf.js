const name = require('./package.json').name

process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function(config) {
  config.set({
    frameworks: ['karma-typescript', 'tap'],
    files: [
      'index.ts',
      'pull.ts',
      'types.ts',
      'util/**/*.ts',
      'sinks/**/*.ts',
      'sources/**/*.ts',
      'test/**/*.ts',
      'throughs/**/*.ts'
    ],
    preprocessors: {
      '**/*.ts': 'karma-typescript'
    },
    reporters: ['progress', 'karma-typescript'],
    browsers: ['puppeteer'],
    customLaunchers: {
      puppeteer: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    },
    karmaTypescriptConfig: {
      compilerOptions: {
        module: "CommonJS",
        sourceMap: true,
        target: "ES5"
      },
      bundlerOptions: {
        transforms: [
          require("karma-typescript-es6-transform")()
        ]
      }
    }
  })

  if (process.env['SAUCE_USERNAME'] && process.env['SAUCE_ACCESS_KEY']) {
    const customLaunchers = {
      "SL_Firefox": {
        base: "SauceLabs",
        browserName: "Firefox",
        version: '55'
      },
      "SL_Chrome": {
        base: "SauceLabs",
        browserName: "Chrome",
        version: "61"
      },
      // "SL_Safari": {
      //   base: "SauceLabs",
      //   browserName: "Safari",
      //   version: "10"
      // },
      // "SL_Edge": {
      //   base: 'SauceLabs',
      //   browserName: 'MicrosoftEdge',
      //   version: '15'
      // },
      // sl_firefox: {
      //   base: 'SauceLabs',
      //   browserName: 'firefox',
      //   version: '30'
      // },
      // sl_ios_safari: {
      //   base: 'SauceLabs',
      //   browserName: 'iphone',
      //   platform: 'OS X 10.9',
      //   version: '7.1'
      // },
      // sl_ie_11: {
      //   base: 'SauceLabs',
      //   browserName: 'internet explorer',
      //   platform: 'Windows 8.1',
      //   version: '11'
      // },
      // sl_android: {
      //   base: 'SauceLabs',
      //   browserName: 'Browser',
      //   platform: 'Android',
      //   version: '4.4',
      //   deviceName: 'Samsung Galaxy S3 Emulator',
      //   deviceOrientation: 'portrait'
      // }
    }

    config.set({
      client: {
        captureConsole: false
      },
      concurrency: 2,
      captureTimeout: 60 * 1000,
      browserNoActivityTimeout: 120 * 1000,
      browserDisconnectTimeout: 15 * 1000,
      browserDisconnectTolerance: 3,
      sauceLabs: {
        testName: `${name} karma test`,
        tunnelIdentifier: process.env.TRAVIS
          ? process.env.TRAVIS_JOB_NUMBER
          : name
      },
      customLaunchers: customLaunchers,
      browsers: Object.keys(customLaunchers),
      reporters: ['progress', 'karma-typescript', 'saucelabs'],
      singleRun: true
    })
  }
}
