const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  appUrl: '/ansible/catalog/approval',
  debug: true,
  useProxy: false,
  deployment: process.env.BETA ? 'beta/apps' : 'apps'
});

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')({
    root: resolve(__dirname, '../'),
    useFileHash: false
  })
);

module.exports = {
  ...webpackConfig,
  plugins
};
