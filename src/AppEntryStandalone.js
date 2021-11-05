import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './utilities/store';
import App from './AppStandalone';
import { getBaseName } from '@redhat-cloud-services/frontend-components-utilities/helpers';
import PropTypes from 'prop-types';

const AppEntry = () => (<Provider store={ store() }>
  { /* eslint-disable-next-line no-undef */ }
  <Router basename=''>
    <App/>
  </Router>
</Provider>
);

AppEntry.propTypes = {
  logger: PropTypes.func
};

export default AppEntry;
