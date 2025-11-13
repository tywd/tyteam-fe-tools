// 引入 axios 库
import axios, { AxiosInstance } from 'axios';
import { RequestConfig } from './types';
import { requestInterceptor, requestError, responseInterceptor, responseError } from './interceptors';
import { cancelAllRequests } from './requestManager';

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '/api' : '/prod', // 根据环境设置基础URL
  timeout: 5000, // 全局超时时间（5秒）
  headers: { 'Content-Type': 'application/json' }
});

// 请求拦截器
service.interceptors.request.use(requestInterceptor, requestError);

// 响应拦截器
service.interceptors.response.use(responseInterceptor, responseError);

// 封装请求方法
const request = {
  get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return service.get(url, config);
  },
  
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return service.post(url, data, config);
  },
  
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return service.put(url, data, config);
  },
  
  delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return service.delete(url, config);
  },
  
  // 文件下载
  download(url: string, filename: string, config?: RequestConfig): Promise<void> {
    return service({
      method: 'get',
      url,
      responseType: 'blob',
      ...config
    }).then((response: any) => {
      const blob = new Blob([response.data]);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    });
  },
  
  // 取消所有请求
  cancelAllRequests(): void {
    cancelAllRequests();
  }
};

export default request;
export * from './types';