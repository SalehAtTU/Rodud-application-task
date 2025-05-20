// webpack.config.js
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // On web, alias react-native-maps to our stub
  if (config.resolve && config.resolve.alias) {
    config.resolve.alias['react-native-maps'] = require.resolve(
      './src/shims/MapViewStub.js'
    );
  }

  return config;
};
