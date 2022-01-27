import { getWorkflowApi, getTemplateApi, getAxiosInstance } from '../shared/user-login';
import { defaultSettings } from '../shared/pagination';
import { APPROVAL_API_BASE } from '../../utilities/constants';

const workflowApi = getWorkflowApi();
const templateApi = getTemplateApi();

export function fetchWorkflows(filter = '', pagination = defaultSettings) {
  const paginationQuery = `&limit=${Math.max(pagination.limit, 10)}&offset=${pagination.offset}`;
  const filterQuery = `&name=${filter}`;

  return getAxiosInstance().get(
    `${APPROVAL_API_BASE}/workflows/?${filterQuery}${paginationQuery}`
  );
}

export const fetchWorkflow = (id) =>  getAxiosInstance().get(
  `${APPROVAL_API_BASE}/workflows/${id}/`
);;

export function updateWorkflow(data) {
  return getAxiosInstance().patch(
    `${APPROVAL_API_BASE}/workflows/?${data.id}`, data
  );
}

export function repositionWorkflow(data) {
  return getAxiosInstance().patch(
    `${APPROVAL_API_BASE}/workflows/?${data.id}`, data.sequence
  );
}

export  function addWorkflow(workflow) {
  return templateApi.listTemplates().then(({ data }) => {
    // workaround for v1. Need to pass template ID with the workflow. Assigning to first template
    if (!data[0]) {
      throw new Error('No template exists');
    }

    return data[0].id;

  }).then(id => workflowApi.addWorkflowToTemplate(id, workflow, {}));
}

export async function removeWorkflow(workflowId) {
  return await workflowApi.destroyWorkflow(workflowId);
}

export async function removeWorkflows(selectedWorkflows) {
  return Promise.all(selectedWorkflows.map(async workflowId => await workflowApi.destroyWorkflow(workflowId)));
}

