const path = require("path");
const fs = require('fs');
const webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {


    devtool: 'cheap-moudle-source-map',

    mode: 'development',

    devServer: {
        historyApiFallback: true,
        contentBase: './',
        hot: true
     },

    node: {
        fs: 'empty',
        net:'empty'
    },
     
    entry: path.resolve(__dirname, "./src/index.js"),

    module: {
        rules: [
            
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            "presets": [
                              [
                                "@babel/preset-env", {
                                  "targets": {"chrome": "55"}, /* chrome 55 이상으로 지정 */
                                  "debug": true
                                }
                              ]
                            ]
                        }
                    }
                ]
            },

                                  
            {
                test: /\.(sa|sc|c)ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },

            {
                test: /\.(png|jp(e*)g|svg|gif|JPG|mp4)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            esModule: false
                          }
                        // options: { name: 'images/[hash]-[name].[ext]' },
                    },
                ],
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'file-loader',
                        options: { name: 'fonts/[hash]-[name].[ext]' },
                    },
                ],
            }
        ]
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "bundle.js"
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),

        new webpack.DefinePlugin({
            DEPLOYED_ADDRESS: JSON.stringify(fs.readFileSync('deployedAddress', 'utf8').replace(/\n|\r/g, "")),
            DEPLOYED_ABI: fs.existsSync('deployedABI') && fs.readFileSync('deployedABI', 'utf8'),
            DEPLOYED_ADDRESS_REWARDTOKEN: JSON.stringify(fs.readFileSync('deployedAddress_RewardToken', 'utf8').replace(/\n|\r/g, "")),
            DEPLOYED_ABI_REWARDTOKEN: fs.existsSync('deployedABI_RewardToken') && fs.readFileSync('deployedABI_RewardToken', 'utf8')
        }),

    ],

    resolve: {
        alias: {
            assets: path.resolve(__dirname, "./src/assets"),
            components: path.resolve(__dirname, "./src/components"),
            views: path.resolve(__dirname, "./src/views"),
            variables: path.resolve(__dirname, "./src/variables"),
        }
    }

};