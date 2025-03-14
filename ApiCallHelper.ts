import axios from 'axios';
import { get } from 'lodash';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/',
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRF-TOKEN': get(
      document.querySelector('meta[name="csrf-token"]'),
      'content',
    ),
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

class ApiCallHelper {
  private static instance: ApiCallHelper;

  constructor() {
    if (!ApiCallHelper.instance) {
      ApiCallHelper.instance = this;
    }
    return ApiCallHelper.instance;
  }

  async get(url: string) {
    return this.request('get', url);
  }

  async post(url: string, data?: any) {
    return this.request('post', url, data);
  }

  async put(url: string, data?: any) {
    return this.request('put', url, data);
  }

  async patch(url: string, data?: any) {
    return this.request('patch', url, data);
  }

  async delete(url: string) {
    return this.request('delete', url);
  }

  private async request(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    data?: any,
  ) {
    try {
      const path = url?.includes('api/') ? url : `api/${url}`;
      const response = await axiosInstance({ method, url: path, data });

      return response.data;
    } catch (error) {
      console.error(error?.response?.data || error?.message);
    }
  }
}

const apiCallHelper = new ApiCallHelper();
export default apiCallHelper;
