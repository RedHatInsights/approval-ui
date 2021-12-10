import {
  CheckCircleIcon,
  InfoCircleIcon,
  ErrorCircleOIcon,
  ExclamationCircleIcon
} from '@patternfly/react-icons';
import React from 'react';
import requestsMessages from '../messages/requests.messages';

// eslint-disable-next-line no-undef
export const APPROVAL_API_BASE = DEPLOYMENT_MODE === 'standalone'
  ? // eslint-disable-next-line no-undef
  `${API_HOST}${API_BASE_PATH}`
  : `${process.env.BASE_PATH || '/api'}/approval/v1.2`;
export const RBAC_API_BASE = `${process.env.BASE_PATH || '/api'}/rbac/v1`;

export const decisionValues = {
  undecided: { displayName: requestsMessages.needsReview, color: 'blue', icon: <InfoCircleIcon /> },
  approved: { displayName: requestsMessages.approved, color: 'green', icon: <CheckCircleIcon /> },
  denied: { displayName: requestsMessages.denied, color: 'red', icon: <ExclamationCircleIcon /> },
  canceled: { displayName: requestsMessages.canceled, color: 'red', icon: <ErrorCircleOIcon /> },
  error: { displayName: requestsMessages.error, color: 'red', icon: <ExclamationCircleIcon /> }
};

// React intl does not support empty strings
export const untranslatedMessage = (defaultMessage = ' ') => ({ id: 'untranslated', defaultMessage });
export const APP_DISPLAY_NAME = {
  catalog: 'Automation Services Catalog',
  topology: 'Topological inventory'
};
