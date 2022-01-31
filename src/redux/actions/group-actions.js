import { FETCH_RBAC_GROUPS } from '../action-types';
import * as GroupHelper from '../../helpers/group/group-helper';
import { isStandalone } from '../../helpers/shared/helpers';

export const fetchRbacApprovalGroups = () => ({
  type: FETCH_RBAC_GROUPS,
  payload: isStandalone() ? GroupHelper.fetchFilterApprovalGroupsS() : GroupHelper.fetchFilterApprovalGroups()
});
