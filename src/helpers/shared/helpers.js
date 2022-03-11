import React from 'react';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import { APPROVAL_ADMIN_ROLE, APPROVAL_APPR_ROLE } from '../../utilities/constants';

export const isStandalone = () =>
  !!localStorage.getItem('catalog_standalone');

const activeStates = [ 'notified' ];
export const APPROVAL_ADMINISTRATOR_ROLE = isStandalone() ? 'approval-admin' : 'Approval Administrator';
export const APPROVAL_APPROVER_ROLE = isStandalone() ? 'approval-approver' : 'Approval Approver';
export const APPROVAL_ADMIN_PERSONA = 'approval/admin';
export const APPROVAL_APPROVER_PERSONA = 'approval/approver';
export const APPROVAL_REQUESTER_PERSONA = 'approval/requester';

export const isRequestStateActive = (state) => activeStates.includes(state);

export const timeAgo = (date) => (
  <span key={ date }>
    <DateFormat date={ date } type="relative" />
  </span>
);

const useIsApprovalAdminI = (roles = {}) => roles[APPROVAL_ADMINISTRATOR_ROLE];
const useIsApprovalApproverI = (roles = {}) => roles[APPROVAL_APPROVER_ROLE];

export const useIsApprovalAdminS = (roles = []) => roles ? roles.includes(APPROVAL_ADMIN_ROLE) : false;
export const useIsApprovalApproverS = (roles = []) => roles ? roles.includes(APPROVAL_APPR_ROLE) : false;

export const useIsApprovalAdmin = (roles) => isStandalone() ? useIsApprovalAdminS(roles) : useIsApprovalAdminI(roles);
export const useIsApprovalApprover = (roles) => isStandalone() ? useIsApprovalApproverS(roles) : useIsApprovalApproverI(roles);

export const approvalPersona = (userRoles) => {
  const isApprovalAdmin = useIsApprovalAdmin(userRoles);
  const isApprovalApprover = useIsApprovalApprover(userRoles);

  if (isApprovalAdmin) {
    return APPROVAL_ADMIN_PERSONA;
  } else if (isApprovalApprover) {
    return APPROVAL_APPROVER_PERSONA;
  }

  return APPROVAL_REQUESTER_PERSONA;
};

export const approvalRoles = (roles = []) => {
  const userRoles  = {};
  roles.forEach(role => {
    if (role.name === APPROVAL_ADMINISTRATOR_ROLE) {
      userRoles[APPROVAL_ADMINISTRATOR_ROLE] = true;
    } else if (role.name === APPROVAL_APPROVER_ROLE) {
      userRoles[APPROVAL_APPROVER_ROLE] = true;
    }
  });
  return userRoles;
};
