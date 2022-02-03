/* eslint camelcase: 0 */
import { APPROVAL_API_BASE } from '../../utilities/constants';
import { getAxiosInstance } from '../shared/user-login';
const axiosInstance = getAxiosInstance();

export const getUser = () => axiosInstance.get(`${APPROVAL_API_BASE}/me/`);

export const logoutUser = () => {
  localStorage.removeItem('catalog_user');
  return axiosInstance.post(`${APPROVAL_API_BASE}/logout/`);
};

export const loginUser = () => {
  window.location.replace(APPROVAL_API_BASE);
  return null;
};
