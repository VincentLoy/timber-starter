const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const siteConfig = JSON.parse(fs.readFileSync('.site.config.json'));


const cssLoaders = [
    // 'style-loader',
    {
        loader: 'css-loader',
        options: {
            importLoaders: 1
        }
    },
    {
        loader: 'postcss-loader',
        options: {
            plugins: (loader) => [
                autoprefixer(),
            ]
        }
    },
    'resolve-url-loader',
];

const config = {
    url: siteConfig.domain,
    fullPath: path.resolve(__dirname, '.')
};

let conf = merge(common, {
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'static'),
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        historyApiFallback: true,
        compress: true,
        port: 9000,
        https: false,
        publicPath: config.fullPath,
        proxy: {
            '*': {
                target: config.url,
                secure: false
            },
            '/': {
                target: config.url,
                secure: false
            }
        },
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '',
                        },
                    },
                    ...cssLoaders,
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '',
                        },
                    },
                    ...cssLoaders,
                    'sass-loader',
                ],
            },
            {
                test: /\.(woff2?|ttf|otf|eot)$/,
                // exclude: /node_modules/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts'
                }
            },
            {
                test: /\.(svg|png|jpg|gif|ico)$/,
                // exclude: /node_modules/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'img'
                }
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // all options are optional
            filename: '[name].css',
            chunkFilename: '[id].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
        new BrowserSyncPlugin( {
                proxy: config.url,
                files: [
                    '**/*.php',
                    '**/*.twig',
                    'static/**/*.js',
                    '**/*.css',
                ],
                reloadDelay: 0
            }
        ),
    ]
});

module.exports = conf;