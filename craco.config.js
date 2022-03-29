const webpack = require("webpack");

module.exports = {
  webpack: {
    plugins: [
      new webpack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"],
      }),
    ],
    configure: {
      resolve: {
        fallback: {
          buffer: require.resolve("buffer"),
          crypto: require.resolve("crypto-browserify"),
          path: require.resolve("path-browserify"),
          stream: require.resolve("stream-browserify"),
        },
      },
    },
  },
};
