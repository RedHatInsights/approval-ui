import asyncDebounce from '../utilities/async-debounce';
import { fetchFilterApprovalGroups, fetchFilterApprovalGroupsS } from '../helpers/group/group-helper';
import { isStandalone } from '../helpers/shared/helpers';

export default asyncDebounce(isStandalone() ? fetchFilterApprovalGroupsS : fetchFilterApprovalGroups);
