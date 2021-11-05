import React, { Suspense } from 'react';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import { Routes } from './Routes';
import { AppPlaceholder } from './presentational-components/shared/loader-placeholders';
// react-int eng locale data
import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom';
import '@patternfly/patternfly/patternfly.scss'

import UserContext from './user-context';

import './App.scss';
import { PageSection } from '@patternfly/react-core';

const pathName = window.location.pathname.split('/');

pathName.shift();

const release = '/';

const App = () => {
  return (
    <BrowserRouter basename={ `${release}${pathName[0]}/${pathName[1]}/${pathName[2]}` }>
      <Suspense fallback={ <AppPlaceholder /> }>
        <IntlProvider locale="en">
          <UserContext.Provider value={ { userRoles: { 'Approval Administrator': true }} }>
            <React.Fragment>
              <NotificationsPortal />
              <PageSection className="pf-u-p-0 pf-u-ml-0">
                <Routes/>
              </PageSection>
            </React.Fragment>
          </UserContext.Provider>
        </IntlProvider>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
