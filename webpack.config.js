module.exports = {
  mode: "development",
  entry: {
    loader: "./src/loader.js",
    plugin: "./src/plugin.js"
  },
  output: {
    path: __dirname+'/dist',
    filename: "[name].js",
    libraryTarget: "commonjs2"
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['env'],
            plugins: ['transform-object-rest-spread']
          }
        }
      }
    ]
  }
}