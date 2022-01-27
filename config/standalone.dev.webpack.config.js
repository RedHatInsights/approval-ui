const webpackBase = require('./webpack.base.config');

// Used for getting the correct host when running in a container
const proxyHost = process.env.ANSIBLE_CATALOG_API_PROXY_HOST || 'localhost';
const proxyPort = process.env.ANSIBLE_CATALOG_API_PROXY_PORT || '5001';
const apiBasePath = process.env.ANSIBLE_CATALOG_API_BASE_PATH || '/api/ansible-catalog/v1';

module.exports = webpackBase({
  // The host where the API lives. EX: https://localhost:5001
  ANSIBLE_CATALOG_API_HOST: 'http://127.0.0.1:8000',

  // Path to the API on the API host. EX: /api/ansible-catalog
  ANSIBLE_CATALOG_API_BASE_PATH: apiBasePath,

  // Port that the UI is served over
  ANSIBLE_CATALOG_UI_PORT: 8003,

  // Determines if the app should be compiled to run on insights or on
  // another platform. Options: insights, standalone
  ANSIBLE_CATALOG_DEPLOYMENT_MODE: 'standalone',

  // Serve the UI over http or https. Options: true, false
  ANSIBLE_CATALOG_UI_USE_HTTPS: false,

  // Enables webpack debug mode. Options: true, false
  ANSIBLE_CATALOG_UI_DEBUG: true,

  // Target compilation environment. Options: dev, prod
  ANSIBLE_CATALOG_TARGET_ENVIRONMENT: 'dev',

  // Value for webpack.devServer.proxy
  // https://webpack.js.org/configuration/dev-server/#devserverproxy
  // used to get around CORS requirements when running in dev mode
  ANSIBLE_CATALOG_WEBPACK_PROXY: {
    '/api/': `http://${proxyHost}:${proxyPort}`
  }
});