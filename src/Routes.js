import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import React, { lazy, useContext, useState, useEffect } from 'react';
import paths from './constants/routes';
import UserContext from './user-context';
import { useIsApprovalAdmin, useIsApprovalApprover } from './helpers/shared/helpers';
import RequestsRoute from './routing/requests-route';
import CatalogRoute from './routing/protected-route-s';

const Requests = lazy(() => import(/* webpackChunkName: "requests" */ './smart-components/request/requests'));
const MyRequestDetail = lazy(() => import(/* webpackChunkName: "request-detail" */ './smart-components/request/request-detail/my-request-detail'));
const AllRequestDetail = lazy(() =>
  import(/* webpackChunkName: "all-request-detail" */ './smart-components/request/request-detail/all-request-detail'));
const Workflows = lazy(() => import(/* webpackChunkName: "workflows" */ './smart-components/workflow/workflows'));
const AllRequests = lazy(() => import(/* webpackChunkName: "requests" */ './smart-components/request/allrequests'));
const CommonApiError = lazy(() => import(/* webpackChunkName: "error-page" */ './smart-components/error-pages/common-api-error'));

const errorPaths = [ '/400', '/401', '/403', '/404' ];

export const Routes = () => {
  const { userRoles: userRoles } = useContext(UserContext);
  const location = useLocation();
  const isApprovalAdmin = useIsApprovalAdmin(userRoles);
  const isApprovalApprover = useIsApprovalApprover(userRoles);

  const [ defaultRequestPath, setDefaultRequestPath ] = useState(paths.requests.index);

  console.log('Debug - userRoles: ', userRoles);
  useEffect(() => {
    if (isApprovalApprover || isApprovalAdmin) {
      setDefaultRequestPath(paths.requests.index);
    }
    else
    {
      setDefaultRequestPath({
        pathname: '/403',
        state: {
          from: location
        }
      });
    }
  }, [ userRoles ]);

  return <Switch>
    <CatalogRoute path={ paths.workflows.index } component={ Workflows }/>
    <RequestsRoute path={ paths.requests.index } component={ Requests }/>
    <CatalogRoute path={ paths.allrequests.index } component={ AllRequests }/>
    <CatalogRoute path={ paths.request.index } component={ MyRequestDetail }/>
    <CatalogRoute path={ paths.allrequest.index } component={ AllRequestDetail }/>
    <Route path={ errorPaths } component={ CommonApiError }/>
    <CatalogRoute>
      <Redirect to={ defaultRequestPath }/>
    </CatalogRoute>
  </Switch>;
};
