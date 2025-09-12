const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Completely disable file watching to prevent EMFILE
config.watchFolders = [];
config.resolver.platforms = ['ios', 'android'];

// Override transformer to disable watching
config.transformer = {
  ...config.transformer,
  enableBabelRCLookup: false,
  enableBabelRuntime: false,
};

// Disable file watching in server
config.server = {
  ...config.server,
  enableVisualizer: false,
  port: 8081,
};

// Override watcher to use polling instead of filesystem events
config.watcher = {
  ...config.watcher,
  watchman: false,
  healthCheck: false,
};

module.exports = config;