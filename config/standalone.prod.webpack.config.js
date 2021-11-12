const webpackBase = require('./webpack.base.config');

// Compile configuration for stnadalone mode
module.exports = webpackBase({
  ANSIBLE_CATALOG_API_HOST: '',
  ANSIBLE_CATALOG_API_BASE_PATH: '/api/ansible-catalog',
  ANSIBLE_CATALOG_DEPLOYMENT_MODE: 'standalone',
  ANSIBLE_CATALOG_UI_USE_HTTPS: false,
  ANSIBLE_CATALOG_UI_DEBUG: false,
  ANSIBLE_CATALOG_TARGET_ENVIRONMENT: 'prod',
  ANSIBLE_CATALOG_WEBPACK_PUBLIC_PATH: '/static/ansible-catalog/'
});
