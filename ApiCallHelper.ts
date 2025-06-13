import axios from 'axios';
import { get } from 'lodash';

export default class ApiCallHelper {
  // Default axios Instance, can be overwritten in contructor
  private axiosInstance = axios.create({
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

  constructor(axiosInstance: any) {
    if (axiosInstance) {
      this.axiosInstance = axiosInstance;
    }
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

  private async request(method: string, url: string, data?: any) {
    try {
      const path = url?.includes('api/') ? url : `api/${url}`;
      let request = null;

      if (method == 'get') {
        request = this.axiosInstance.get(path);
      }
      if (method == 'post') {
        request = this.axiosInstance.post(path, data);
      }
      if (method == 'put') {
        request = this.axiosInstance.put(path, data);
      }
      if (method == 'patch') {
        request = this.axiosInstance.patch(path, data);
      }
      if (method == 'delete') {
        request = this.axiosInstance.delete(path);
      }

      if (!request) {
        return null;
      }

      let result = await request.then((response) => {
        return response?.data;
      });

      return result ?? null;
    } catch (error) {
      console.error(error?.response?.data || error?.message);
    }
  }
}
