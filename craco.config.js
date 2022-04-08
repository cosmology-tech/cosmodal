const webpack = require("webpack");
const path = require("path");

module.exports = {
  webpack: {
    entry: "./src/index.ts",
    plugins: [
      new webpack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"],
      }),
    ],
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.mode = "production";
      webpackConfig.entry = {
        index: "./src/index.ts",
      };
      webpackConfig.output = {
        path: path.resolve(__dirname, "dist"),
        publicPath: "/dist/",
        filename: "[name].js",
        libraryTarget: "umd",
        library: "cosmodal",
        umdNamedDefine: true,
        globalObject: "this",
      };
      webpackConfig.resolve = {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        fallback: {
          buffer: require.resolve("buffer"),
          crypto: require.resolve("crypto-browserify"),
          path: require.resolve("path-browserify"),
          stream: require.resolve("stream-browserify"),
        },
      };

      return webpackConfig;
    },
  },
};
