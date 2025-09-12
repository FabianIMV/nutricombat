const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    // Override the public path for GitHub Pages
    mode: env.mode || 'production',
  }, argv);

  // Set the public path for GitHub Pages deployment
  if (env.mode === 'production') {
    config.output.publicPath = '/nutricombat/';
  }

  return config;
};