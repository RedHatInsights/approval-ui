
import promiseMiddleware from 'redux-promise-middleware';
import ReducerRegistry, { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';

import thunk from 'redux-thunk';
import requestReducer, { requestsInitialState } from '../redux/reducers/request-reducer';
import workflowReducer, { workflowsInitialState } from '../redux/reducers/workflow-reducer';
import groupReducer, { groupsInitialState } from '../redux/reducers/group-reducer';

const getStore = (middlewares = []) => {
  const registry = new ReducerRegistry(
    {},
    [
      thunk,
      promiseMiddleware,
      notificationsMiddleware({
        errorTitleKey: [ 'errors', 'message', 'statusText' ],
        errorDescriptionKey: [
          'data.errors[0].detail',
          'data.errors',
          'data.error',
          'data.message',
          'data.detail',
          'response.body.errors',
          'data',
          'errorMessage',
          'stack',
          'detail'
        ]
      }),
      ...middlewares
    ]
  );

  registry.register({
    requestReducer: applyReducerHash(requestReducer, requestsInitialState),
    workflowReducer: applyReducerHash(workflowReducer, workflowsInitialState),
    groupReducer: applyReducerHash(groupReducer, groupsInitialState),
    notifications: notificationsReducer
  });

  return registry.getStore();
};

export default getStore;
