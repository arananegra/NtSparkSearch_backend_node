let path = require('path');
let webpack = require("webpack");
let CleanWebpackPlugin = require('clean-webpack-plugin');
//let nodeExternals = require('webpack-node-externals');

let basePath = __dirname;

//module.exports = function(env) {

//    return {
let config = {
        context: path.join(basePath, 'src'),
        resolve: {
            // .js is required for react imports.
            // .tsx is for our app entry point.
            // .ts is optional, in case you will be importing any regular ts files.
            extensions: ['.ts', '.tsx', '.js', '.jsx']
        },
        target: "node",
        //externals: [nodeExternals()],

        node: {
            fs: "empty",
            net: "empty"
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
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                },
                {
                    test: /\.json$/,
                    exclude: /node_modules/,
                    loader: 'json-loader',
                },
            ]
        },

        plugins:[
            new CleanWebpackPlugin(['./dist'], {
                //root: basePath,
                verbose: true,   // Write logs to console
                dry: false,     // Use boolean "true" to test/emulate delete. (will not remove files).
                                // (Default: "false", remove files)
                watch: true     // If true, remove files on recompile. (Default: false)
                //exclude: ['RunExpress.js']
            })
        ]
    }

module.exports = config;