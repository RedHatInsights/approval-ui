/* global require, module, __dirname */
const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const TSOverrides = require('./webpack-ts-overrides');
const webpack = require('webpack');

// Default user defined settings
const defaultConfigs = [
  // Global scope means that the variable will be available to the app itself
  // as a constant after it is compiled
  { name: 'ANSIBLE_CATALOG_API_HOST', default: '', scope: 'global' },
  { name: 'ANSIBLE_CATALOG_API_BASE_PATH', default: '', scope: 'global' },
  { name: 'ANSIBLE_CATALOG_DEPLOYMENT_MODE', default: 'standalone', scope: 'global' },
  { name: 'ANSIBLE_CATALOG_NAMESPACE_TERM', default: 'namespaces', scope: 'global' },
  { name: 'ANSIBLE_CATALOG_APPLICATION_NAME', default: 'Catalog', scope: 'global' },

  // Webpack scope means the variable will only be available to webpack at
  // build time
  { name: 'ANSIBLE_CATALOG_UI_USE_HTTPS', default: false, scope: 'webpack' },
  { name: 'ANSIBLE_CATALOG_UI_DEBUG', default: false, scope: 'webpack' },
  { name: 'ANSIBLE_CATALOG_TARGET_ENVIRONMENT', default: 'prod', scope: 'webpack' },
  { name: 'ANSIBLE_CATALOG_UI_PORT', default: 8003, scope: 'webpack' },
  { name: 'ANSIBLE_CATALOG_WEBPACK_PROXY', default: undefined, scope: 'webpack' },
  { name: 'ANSIBLE_CATALOG_WEBPACK_PUBLIC_PATH', default: undefined, scope: 'webpack' },
  { name: 'ANSIBLE_CATALOG_USE_FAVICON', default: true, scope: 'webpack' }
];

module.exports = (inputConfigs) => {
  const customConfigs = {};
  const globals = {};

  defaultConfigs.forEach((item, i) => {
    // == will match null and undefined, but not false
    if (inputConfigs[item.name] == null) {
      customConfigs[item.name] = item.default;
    } else {
      customConfigs[item.name] = inputConfigs[item.name];
    }

    if (item.scope === 'global') {
      globals[item.name] = JSON.stringify(
        inputConfigs[item.name] || item.default
      );
    }
  });

  const htmlPluginConfig = {
    targetEnv: customConfigs.ANSIBLE_CATALOG_DEPLOYMENT_MODE
  };

  // being able to turn off the favicon is useful for deploying to insights mode
  // console.redhat.com sets its own favicon and ours tends to override it if we
  // set one
  if (customConfigs.ANSIBLE_CATALOG_USE_FAVICON) {
    htmlPluginConfig.favicon = 'src/assets/images/favicon.ico';
  }

  const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../'),
    htmlPlugin: htmlPluginConfig,
    debug: customConfigs.ANSIBLE_CATALOG_UI_DEBUG,
    https: customConfigs.ANSIBLE_CATALOG_UI_USE_HTTPS,

    // defines port for dev server
    port: customConfigs.ANSIBLE_CATALOG_UI_PORT
  });

  // Override sections of the webpack config to work with TypeScript
  const newWebpackConfig = {
    ...webpackConfig,
    ...TSOverrides
  };
  if (customConfigs.ANSIBLE_CATALOG_WEBPACK_PROXY) {
    newWebpackConfig.devServer.proxy = customConfigs.ANSIBLE_CATALOG_WEBPACK_PROXY;
  }

  if (customConfigs.ANSIBLE_CATALOG_WEBPACK_PUBLIC_PATH) {
    console.log(`New output.publicPath: ${customConfigs.ANSIBLE_CATALOG_WEBPACK_PUBLIC_PATH}`);
    newWebpackConfig.output.publicPath = customConfigs.ANSIBLE_CATALOG_WEBPACK_PUBLIC_PATH;
  }

  if (customConfigs.ANSIBLE_CATALOG_DEPLOYMENT_MODE === 'standalone') {
    console.log('Overriding configs for standalone mode.');

    const newEntry = resolve(__dirname, '../src/entry-standalone.js');
    console.log(`New entry.App: ${newEntry}`);
    newWebpackConfig.entry.App = newEntry;
  }

  plugins.push(new webpack.DefinePlugin(globals));
  plugins.push(
    require('@redhat-cloud-services/frontend-components-config/federated-modules')({
      root: resolve(__dirname, '../'),
      bundlePfModules: true,
      useFileHash: false
    })
  );

  return {
    ...newWebpackConfig,
    plugins
  };
};
