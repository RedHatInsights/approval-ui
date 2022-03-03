import { getAxiosInstance } from '../shared/user-login';
import { APPROVAL_API_BASE, RBAC_API_BASE } from '../../utilities/constants';
import { isStandalone } from '../shared/helpers';

const fetchFilterApprovalGroupsI = (filterValue) => {
  const filterQuery = `&name=${filterValue}`;
  return getAxiosInstance().get(`${RBAC_API_BASE}/groups/?role_names=",Approval Administrator,Approval Approver,"
  ${filterValue && filterValue.length > 0
    ? filterQuery : ''}`)
  .then(({ data }) => (data && data.length > 0 ? data.map(({ uuid, name }) => ({ label: name, value: uuid })) : undefined));
};

const fetchFilterApprovalGroupsS = (filterValue) => {
  const filterQuery = `&name=${filterValue}`;
  return getAxiosInstance().get(`${APPROVAL_API_BASE}/groups/?role=approval-approver&role=approval-admin
  ${filterValue && filterValue.length > 0
    ? filterQuery : ''}`)
  .then(({ data }) => (data && data.length > 0 ? data.map(({ id, name }) => ({ label: name, value: id })) : undefined));
};

export const fetchFilterApprovalGroups = (filterValue) => {
  return isStandalone() ? fetchFilterApprovalGroupsS(filterValue) : fetchFilterApprovalGroupsI(filterValue);
};
