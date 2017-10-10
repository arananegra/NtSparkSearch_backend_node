let webpackConfig = require('./pre-compilation');

const path = require('path');

module.exports = function (config) {
    config.set({
        client: {
            mocha: {
                timeout : 8000 // 8 seconds - upped from 2 seconds
            }
        },
        //basePath: '',
        frameworks: ['mocha', 'chai', 'sinon'],
        files: [
            './test/src/**/*.spec.ts'
        ],
        preprocessors: {
            './test/src/**/*.spec.ts': ['webpack'],
            './src/**/*.ts': ['webpack', 'coverage']
        },
        webpack: {
          devtool: webpackConfig.devtool,
          module: webpackConfig.module,
          resolve: webpackConfig.resolve,
          node: webpackConfig.node
        },
        webpackMiddleware: { stats: 'errors-only', noInfo: true },
        mime: { 'text/x-typescript': ['ts','tsx'] },
        plugins: ['karma-chrome-launcher',
                  'karma-sinon',
                  'karma-chai',
                  'karma-mocha',
                  'karma-webpack',
                  'karma-coverage',
                  'karma-coverage-istanbul-reporter'],

        reporters: ['progress', 'coverage-istanbul'],
        //reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        //browsers: ['ChromeHeadless'],
        //customLaunchers: {
        /*ChromeHeadless: {
            base: 'Chrome',
                flags: [
                '--disable-translate',
                '--headless',
                '--disable-gpu',
                '--disable-extensions',
                '--remote-debugging-port=9222',
                ],
            }*/
        //},

        concurrency: Infinity,
        browserConsoleLogOptions: {level: "debug", format: "%b %T: %m", terminal: true},
        // any of these options are valid: https://github.com/istanbuljs/istanbul-api/blob/47b7803fbf7ca2fb4e4a15f3813a8884891ba272/lib/config.js#L33-L38
        coverageIstanbulReporter: {

            // reports can be any that are listed here: https://github.com/istanbuljs/istanbul-reports/tree/590e6b0089f67b723a1fdf57bc7ccc080ff189d7/lib
            reports: ['html', 'lcovonly', 'text', 'text-summary'],

            // base output directory. If you include %browser% in the path it will be replaced with the karma browser name
            dir: path.join(__dirname, 'coverage'),

            // if using webpack and pre-loaders, work around webpack breaking the source path
            fixWebpackSourcePaths: true,

            // stop istanbul outputting messages like `File [${filename}] ignored, nothing could be mapped`
            skipFilesWithNoCoverage: false,

            // Most reporters accept additional config options. You can pass these through the `report-config` option
            'report-config': {

                // all options available at: https://github.com/istanbuljs/istanbul-reports/blob/590e6b0089f67b723a1fdf57bc7ccc080ff189d7/lib/html/index.js#L135-L137
                html: {
                    // outputs the report in ./coverage/html
                    subdir: 'html'
                }

            },

            // enforce percentage thresholds
            // anything under these percentages will cause karma to fail with an exit code of 1 if not running in watch mode
        },
        thresholds: {
            emitWarning: false, // set to `true` to not fail the test command when thresholds are not met
            global: { // thresholds for all files
                statements: 100,
                lines: 100,
                branches: 100,
                functions: 100
            },
            each: { // thresholds per file
                statements: 100,
                lines: 100,
                branches: 100,
                functions: 100,
                overrides: {
                    './src/**/*.ts': {
                        statements: 98
                    }
                }
            }
        }
    });
};