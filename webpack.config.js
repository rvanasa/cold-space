'use strict';

const fs = require('fs');

const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const inputDir = __dirname + '/www';
const outputDir = __dirname + '/docs';

const config = {
    entry: inputDir + '/app.js',
    output: {
        path: outputDir,
        filename: 'bundle/[name].js',
    },
    module: {
        rules: [{
            test: /\.ejs$/,
            use: [{
                loader: 'ejs-webpack-loader',
                options: {
                    data: {
                        fs,
                        require: path => fs.readFileSync('./view/' + path), // shim
                    },
                    // htmlmin: true,
                },
            }],
        }, {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader'],
        }, {
            test: /\.(txt|jpg|png)$/,
            use: 'raw-loader',
        }],
    },
    plugins: [
        new CleanWebpackPlugin(),
        ...fs.readdirSync('./view')
            .filter(name => name.endsWith('.ejs'))
            .map(name => new HtmlWebpackPlugin({
                template: './view/' + name,
                inject: false,
                filename: outputDir + '/' + name.replace('.ejs', '.html'),
            })),
        new MiniCssExtractPlugin({
            filename: 'bundle/[name].css',
        }),
        new CopyWebpackPlugin(
            [{from: inputDir + '/public', to: outputDir}],
        ),
    ],
    devServer: {
        contentBase: outputDir,
        compress: true,
        port: 8888,
    }
};

module.exports = config;