import { getAxiosInstance } from '../shared/user-login';
import { APPROVAL_API_BASE, RBAC_API_BASE } from '../../utilities/constants';

export const fetchFilterApprovalGroups = (filterValue) => {
  const filterQuery = `&name=${filterValue}`;
  return getAxiosInstance().get(`${RBAC_API_BASE}/groups/?role_names=",Approval Administrator,Approval Approver,"
  ${filterValue && filterValue.length > 0
    ? filterQuery : ''}`)
  .then(({ data }) => (data && data.length > 0 ? data.map(({ uuid, name }) => ({ label: name, value: uuid })) : undefined));
};

export const fetchFilterApprovalGroupsS = (filterValue) => {
  const filterQuery = `&name=${filterValue}`;
  return getAxiosInstance().get(`${APPROVAL_API_BASE}/groups/?${filterValue && filterValue.length > 0 ? filterQuery : ''}`)
  .then(({ data }) => (data && data.length > 0 ? data.map(({ id, name }) => ({ label: name, value: id })) : undefined));
};
