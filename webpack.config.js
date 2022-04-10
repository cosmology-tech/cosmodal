const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: {
    index: "./src/index.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    libraryTarget: "umd",
    library: "cosmodal",
    umdNamedDefine: true,
    globalObject: "this",
  },
  devtool: "source-map",
  module: {
    rules: [{ test: /\.tsx?$/, loader: "ts-loader" }],
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      react: path.resolve("./node_modules/react"),
    },
    fallback: {
      buffer: require.resolve("buffer"),
      crypto: require.resolve("crypto-browserify"),
      path: require.resolve("path-browserify"),
      stream: require.resolve("stream-browserify"),
    },
  },
};
