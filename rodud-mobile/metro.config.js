// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // 1. Build a sourceExts list that:
  //    • Puts 'web.js' first 
  //    • Removes all '*.native.js', '*.ios.js', '*.android.js' entries
  const { sourceExts } = config.resolver;
  const webFirst = [
    'web.js',
    // keep the rest but strip out native/ios/android ext
    ...sourceExts.filter(
      ext => !ext.endsWith('native.js') && !ext.endsWith('ios.js') && !ext.endsWith('android.js')
    ),
  ];
  config.resolver.sourceExts = webFirst;

  // 2. Alias react-native-maps to our shim folder
  config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    'react-native-maps': path.resolve(__dirname, 'src/shims/react-native-maps'),
  };

  return config;
})();
