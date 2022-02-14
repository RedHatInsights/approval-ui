import { getAxiosInstance } from '../shared/user-login';
import { APPROVAL_API_BASE } from '../../utilities/constants';
import { defaultSettings } from '../shared/pagination';
import { APPROVAL_REQUESTER_PERSONA, APPROVAL_APPROVER_PERSONA } from '../shared/helpers';

const sortPropertiesMapper = (property) => ({
  'request-id': 'id',
  opened: 'created_at',
  requester: 'requester_name',
  status: 'state'
}[property] || property
);

const filterQuery = (filterValue) => {
  const query = [];
  if (filterValue.name) {
    query.push(`filter[name][contains_i]=${filterValue.name}`);
  }

  if (filterValue.requester) {
    query.push(`filter[requester_name][contains_i]=${filterValue.requester}`);
  }

  if (filterValue.decision) {
    filterValue.decision.forEach(dec => {
      query.push(`filter[decision][eq][]=${dec}`);
    });
  }

  return query.join('&');
};

export function fetchRequests(filter = {}, pagination = defaultSettings, persona = undefined, sortBy) {
  const paginationQuery = `&limit=${Math.max(pagination.limit, 10)}&offset=${pagination.offset}`;
  const sortQuery = `&sort_by=${sortPropertiesMapper(sortBy.property)}:${sortBy.direction}`;
  const fetchUrl = `${APPROVAL_API_BASE}/requests/?${filterQuery(filter)}${paginationQuery}${sortQuery}`;
  const fetchHeaders = persona ? { 'x-rh-persona': persona } : undefined;
  return getAxiosInstance()({ method: 'get', url: fetchUrl, headers: fetchHeaders });
}

export const fetchRequestTranscript = (requestId) => {
  console.log('Debug - fetchRequestTranscript for requestId: ', requestId);
  return getAxiosInstance().get(`${APPROVAL_API_BASE}/requests/${requestId}/?extra=true`);
};

export const fetchRequestContent = (id) => {
  //TODO - fetch the request only until the content endpoint is implemented
  const fetchUrl = `${APPROVAL_API_BASE}/requests/${id}/?extra=true`;
  const fetchHeaders = { 'x-rh-persona': APPROVAL_REQUESTER_PERSONA };
  return getAxiosInstance()({ method: 'get', url: fetchUrl, headers: fetchHeaders });
};

export const fetchRequestCapabilities = (id, isParent) => {
  const fetchUrl = `${APPROVAL_API_BASE}/requests/${id}${isParent ? '/requests' : ''}`;
  const fetchHeaders = { 'x-rh-persona': APPROVAL_REQUESTER_PERSONA };
  return getAxiosInstance()({ method: 'get', url: fetchUrl, headers: fetchHeaders });
};

export async function fetchRequestWithSubrequests(id, persona) {
  const requestData = await fetchRequestTranscript(id, persona);
  console.log('Debu - fetchRequestWithSubrequests - requestData: ', requestData);
  return requestData;
}

export const createRequestAction = (requestId, actionIn) => getAxiosInstance().post(`${APPROVAL_API_BASE}/requests/${requestId}/actions/`, actionIn);
