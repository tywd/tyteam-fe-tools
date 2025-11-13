// 引入 axios 类型
import { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// 定义请求缓存接口
export interface CacheItem {
  data: any;
  timestamp: number;
}

// 定义请求配置接口
export interface RequestConfig extends AxiosRequestConfig {
  retry?: number; // 重试次数
  retryDelay?: number; // 重试延迟
  cache?: boolean; // 是否缓存
  cacheTime?: number; // 缓存时间（毫秒）
  useFormData?: boolean; // 是否使用 FormData
}

// 定义响应数据接口
export interface ResponseData<T = any> {
  code: number;
  data: T;
  msg: string;
}

// 扩展 AxiosError 接口以支持缓存命中情况
export interface CachedAxiosError extends AxiosError {
  __CANCEL__?: boolean;
  data?: any;
}

// 导出 axios 类型以便在其他地方使用
export type { 
  AxiosRequestConfig, 
  AxiosResponse, 
  AxiosError, 
  InternalAxiosRequestConfig 
};