const name = require('./package.json').name

process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'karma-typescript'],
    files: [
      'index.ts',
      'pull.ts',
      'pull.spec.ts',
      'types.ts',
      'util/**/*.ts',
      'sinks/**/*.ts',
      'sources/**/*.ts',
      'test/**/*.ts',
      'throughs/**/*.ts'
    ],
    preprocessors: {
      '**/*.ts': 'karma-typescript',
      '*.ts': 'karma-typescript',
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
      }
    }
  })

  if (process.env['SAUCE_USERNAME'] && process.env['SAUCE_ACCESS_KEY']) {
    const customLaunchers = {
      sl_firefox: {
        base: "SauceLabs",
        browserName: "Firefox",
        version: '55'
      },
      sl_chrome: {
        base: "SauceLabs",
        browserName: "Chrome",
        version: "61"
      },
      sl_safari: {
        base: "SauceLabs",
        browserName: "Safari",
        version: "10"
      },
      sl_edge: {
        base: 'SauceLabs',
        browserName: 'MicrosoftEdge',
        version: '15'
      },
      // sl_ios: {
      //   base: 'SauceLabs',
      //   deviceName: "iPad (5th generation) Simulator",
      //   deviceOrientation: "portrait",
      //   platformVersion: "11.0",
      //   platformName: "iOS",
      //   browserName: "Safari"
      // },
      sl_android: {
        base: 'SauceLabs',
        deviceName: "Android Emulator",
        deviceOrientation: "portrait",
        browserName: "Chrome",
        platformVersion: "6.0",
        platformName: "Android"
      }
    }

    config.set({
      client: {
        captureConsole: false
      },
      retryLimit: 3,
      concurrency: 2,
      captureTimeout: 85 * 1000,
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
