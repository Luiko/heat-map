const config = require('./webpack.config');

module.exports = Object.assign({}, config, {
  devtool: false,
  module: {
    rules: [...config.module.rules, {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader'
  }]}
});
