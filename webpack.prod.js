const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const autoprefixer = require('autoprefixer');
const purgecss = require('@fullhuman/postcss-purgecss');
const purgecssWordpress = require('purgecss-with-wordpress');
const purgecssWoocommerce = require('purgecss-with-woocommerce');


function collectSafelist() {
    return {
        standard: [
            ...purgecssWordpress.safelist,
            ...purgecssWoocommerce.whitelist,
            ...purgecssWoocommerce.whitelistPatterns,
            // Wordpress JS stuff
            'menu-collapser',
            // ReCaptcha
            'grecaptcha-badge',
            // Contact Form 7
            /^wpcf7(-.*)?$/,
            // Timber related
            /^post-type-(.*)?$/,
            /^collapse-(.*)?$/,
            /^page-(.*)?$/,
            /^page-tag-(.*)?$/,
            /^post-(.*)?$/,
            /^tease-(.*)?$/,
        ],
        deep: [

        ]
    };
}

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
                purgecss({
                    content: [
                        'templates/**/*.twig',
                        'static/main.min.js',
                        'helpers/**/*.php',
                        '*.php',
                    ],
                    defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
                    safelist: collectSafelist(),
                })
            ]
        }
    },
    'resolve-url-loader',
];

module.exports = merge(common, {
    output: {
        filename: 'main.min.js',
        path: path.resolve(__dirname, 'static'),
    },
    mode: 'production',
    devtool: 'source-map',
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
            filename: '[name].min.css',
            chunkFilename: '[id].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
    ],
    optimization: {
        minimizer: [new UglifyJsPlugin({
            extractComments: true,
            exclude: /node_modules/,
            sourceMap: false,
        })],
    },
});
