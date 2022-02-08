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
  return getAxiosInstance().get(`${APPROVAL_API_BASE}/requests/${requestId}/?extra=true`);
};

export const fetchRequestContent = (id) => {
  const fetchUrl = `${APPROVAL_API_BASE}/requests/${id}/content`;
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

  console.log('Debug - requestData: ', requestData);
  console.log('Debug - persona: ', requestData);
  if (!requestData || requestData.length === 0) { return {}; }

  if (persona === APPROVAL_APPROVER_PERSONA) {
    if (requestData && requestData.length > 0 && requestData[0].number_of_children > 0) {
      const result = await fetchRequestCapabilities(id, true);

      if (result && result.data) {
        requestData[0].requests = requestData[0].requests.map(request => {
          return {
            ...result.data.find((item) => (item.id === request.id) && item.metadata),
            ...request
          };
        });
      }
    }
    else {
      const request = await fetchRequestCapabilities(id, false);
      if (request) {
        requestData[0] = { ...requestData[0], metadata: request.metadata };
      }
    }
  }

  return requestData[0];
}

export const createRequestAction = (requestId, actionIn) => getAxiosInstance().post(`${APPROVAL_API_BASE}/requests/${requestId}/actions/`, actionIn);
