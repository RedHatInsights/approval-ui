import MockAdapter from 'axios-mock-adapter';
import { getAxiosInstance } from '../user-login';

export const mockApi = new MockAdapter(getAxiosInstance());

