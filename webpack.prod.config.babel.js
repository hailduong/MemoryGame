const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const Visualizer = require('webpack-visualizer-plugin');


module.exports = {
	entry: {
		vendor: ['jquery', 'babel-polyfill', 'react', 'react-dom'],
		topManagementJobs: ['./assets/TopManagementJobs/TopManagementJobs.js']
	},
	devtool: 'source-map',
	watchOptions: {
		ignored: /node_modules/
	},
	output: {
		path: path.resolve(__dirname, '../../public/TopManagementJobs'),
		publicPath: '/public',
		filename: '[name].js',
		library: '[name]',
		libraryTarget: 'window',
		libraryExport: "default",
		chunkFilename: '[name].js'
	},
	externals: {
		jquery: 'jQuery'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['es2015', 'react', 'flow'],
						plugins: [
							"transform-object-assign",
							"transform-class-properties",
							"transform-es2015-parameters",
							"transform-object-rest-spread",
							"syntax-flow",
							'babel-plugin-syntax-dynamic-import'
						]
					}
				}
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						'css-loader',
						{
							loader: 'sass-loader',
							options: {
								outputStyle: 'compressed'
							}
						}
					]
				})
			}
		]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor'
		}),
		new ExtractTextPlugin({
			filename: "[name].css"
		}),
		new Visualizer({
			filename: './statistics.html'
		})
	]
};