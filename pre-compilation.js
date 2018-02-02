let path = require('path');
let webpack = require("webpack");
let nodeExternals = require('webpack-node-externals');

let basePath = __dirname;

    let config = {
        context: path.join(basePath, 'src'),
        resolve: {
            // .js is required for react imports.
            // .tsx is for our app entry point.
            // .ts is optional, in case you will be importing any regular ts files.
            extensions: ['.ts', '.tsx', '.js', '.jsx']
        },
        target: "node",
        externals: [nodeExternals()],

        node: {
            fs: "empty",
            net: "empty",
            tls: "empty"
        },
        entry: {
            app: [
                '../index.ts'
            ]
        },
        output: {
            path: path.join(basePath, './dist'),
            filename: 'ntsparksearch_backend.js'
        },

        // http://webpack.github.io/docs/configuration.html#devtool
        devtool: 'inline-source-map',

        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    use: [{
                        loader: 'awesome-typescript-loader',
                    }]
                },
                {
                    test: /\.(js)$/,
                    exclude: /node_modules|\.spec\.js$/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.json$/,
                    exclude: /node_modules/,
                    loader: 'json-loader',
                },
                {
                    test: /\.(ts|tsx)/,
                    exclude: /(node_modules|spec)/,
                    loaders: ['istanbul-instrumenter-loader'],
                    enforce: 'post'
                }
            ],
        },

        plugins: [
        ]
    }

module.exports = config;


