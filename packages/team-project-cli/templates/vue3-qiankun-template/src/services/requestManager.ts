// 请求管理
import { InternalAxiosRequestConfig } from 'axios';

// 正在请求的列表（防止重复请求）
const pendingRequests = new Map<string, AbortController>();

// 生成请求唯一标识
export const generateRequestKey = (config: InternalAxiosRequestConfig): string => {
  return `${config.method}:${config.url}:${JSON.stringify(config.params)}:${JSON.stringify(config.data)}`;
};

// 取消重复请求
export const cancelPendingRequest = (config: InternalAxiosRequestConfig): void => {
  const requestKey = generateRequestKey(config);
  if (pendingRequests.has(requestKey)) {
    const controller = pendingRequests.get(requestKey);
    controller && controller.abort();
    pendingRequests.delete(requestKey);
  }
};

// 添加请求到待处理列表
export const addPendingRequest = (config: InternalAxiosRequestConfig): void => {
  const requestKey = generateRequestKey(config);
  // 取消已存在的请求
  cancelPendingRequest(config);
  
  // 创建新的 AbortController
  const controller = new AbortController();
  config.signal = controller.signal;
  pendingRequests.set(requestKey, controller);
};

// 从待处理列表中移除请求
export const removePendingRequest = (config: InternalAxiosRequestConfig): void => {
  const requestKey = generateRequestKey(config);
  if (pendingRequests.has(requestKey)) {
    pendingRequests.delete(requestKey);
  }
};

// 取消所有请求
export const cancelAllRequests = (): void => {
  pendingRequests.forEach(controller => {
    controller.abort();
  });
  pendingRequests.clear();
};

// 获取待处理请求数量
export const getPendingRequestCount = (): number => {
  return pendingRequests.size;
};