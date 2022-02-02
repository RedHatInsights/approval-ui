import axios from 'axios';

import { APPROVAL_API_BASE, RBAC_API_BASE } from '../../utilities/constants';
import { RoleApi } from '@redhat-cloud-services/rbac-client';
import { WorkflowApi, ActionApi, TemplateApi } from '@redhat-cloud-services/approval-client';
import { loginUser } from './active-user';
import { stringify } from 'qs';
import Cookies from 'js-cookie';

const createAxiosInstance = () => {
  if (localStorage.getItem('catalog_standalone')) {
    return axios.create({
      paramsSerializer: (params) => stringify(params),
      headers: { 'X-CSRFToken': Cookies.get('csrftoken') }
    });
  } else {
    return axios.create({
      paramsSerializer: (params) => stringify(params)
    });
  }
};

const axiosInstance = createAxiosInstance();

const resolveInterceptor = response => response.data || response;
const errorInterceptor = (error = {}) => {
  if (error.status === 401) {
    loginUser();
    return;
  }
  const requestId = error.response?.headers?.['x-rh-insights-request-id'];
  throw requestId
    ? { ...error.response, requestId }
    : { ...error.response };
};

// check identity before each request. If the token is expired it will log out user
axiosInstance.interceptors.request.use(async (config) => {
  // eslint-disable-next-line no-undef
  if (!localStorage.getItem('catalog_standalone')) {
    await window.insights.chrome.auth.getUser();
  } else {
    const csrftoken = Cookies.get('csrftoken');
    if (csrftoken) {
      config.headers['X-CSRFToken'] = csrftoken;
    }
  }

  return config;
});

axiosInstance.interceptors.response.use(resolveInterceptor);
axiosInstance.interceptors.response.use(null, errorInterceptor);

// Approval Apis

const workflowApi = new WorkflowApi(undefined, APPROVAL_API_BASE, axiosInstance);
const actionApi = new ActionApi(undefined, APPROVAL_API_BASE, axiosInstance);
const templateApi = new TemplateApi(undefined, APPROVAL_API_BASE, axiosInstance);
const rbacRoleApi = new RoleApi(undefined, RBAC_API_BASE, axiosInstance);

// Approval APIs
export function getTemplateApi() {
  return templateApi;
}

export function getWorkflowApi() {
  return workflowApi;
}

export function getActionApi() {
  return actionApi;
}

export function getAxiosInstance() {
  return axiosInstance;
}

export function getRbacRoleApi() {
  return rbacRoleApi;
}

const grapqlInstance = axios.create();
grapqlInstance.interceptors.request.use(async (config) => {
  if (!localStorage.getItem('catalog_standalone')) {
    await window.insights.chrome.auth.getUser();
  }

  return config;
});
/**
 * Graphql does not return error response when the query fails.
 * Instead it returns 200 response with error object.
 * We catch it and throw it to trigger the notification middleware
 */
grapqlInstance.interceptors.response.use(({ data }) => {
  if (data.errors) {
    throw {
      message: data.errors[0].errorType,
      data: data.errors[0].message
    };
  }

  return data;
});

export function getGraphqlInstance() {
  return grapqlInstance;
}
