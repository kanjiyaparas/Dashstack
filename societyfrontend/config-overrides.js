const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve.fallback = {
    // util: require.resolve("util/"),
    stream: require.resolve("stream-browserify"),
    buffer: require.resolve("buffer/"),
    process: require.resolve("process/browser.js"),
    crypto: require.resolve("crypto-browserify"),
  };
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser.js",
    }),
  ]);
  return config;
};
