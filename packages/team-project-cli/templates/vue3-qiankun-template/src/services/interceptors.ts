// 拦截器服务
import { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { RequestConfig, ResponseData, CachedAxiosError } from './types';
import { getCacheData, setCacheData } from './cache';
import { addPendingRequest, removePendingRequest, generateRequestKey } from './requestManager';

// 请求拦截器
export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  // 处理 FormData
  if ((config as RequestConfig).useFormData && config.data) {
    const formData = new FormData();
    Object.keys(config.data).forEach(key => {
      formData.append(key, config.data[key]);
    });
    config.data = formData;
    // 删除 Content-Type，让浏览器自动设置
    delete config.headers['Content-Type'];
  }
  
  // 添加 token
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // 检查是否需要缓存（仅限 GET 请求）
  const requestConfig = config as RequestConfig;
  if (requestConfig.cache && config.method?.toUpperCase() === 'GET') {
    const cacheKey = generateRequestKey(config);
    const cacheData = getCacheData(cacheKey, requestConfig.cacheTime);
    if (cacheData) {
      // 如果有缓存，直接返回缓存数据
      return Promise.reject({ 
        __CANCEL__: true, 
        message: 'Request cached',
        data: cacheData 
      } as CachedAxiosError);
    }
  }
  
  // 添加到待处理请求列表（防止重复请求）
  addPendingRequest(config);
  
  return config;
};

// 请求错误处理
export const requestError = (error: AxiosError) => {
  return Promise.reject(error);
};

// 响应拦截器
export const responseInterceptor = (response: AxiosResponse) => {
  // 从待处理列表中移除请求
  removePendingRequest(response.config);
  
  // 处理缓存
  const requestConfig = response.config as RequestConfig;
  if (requestConfig.cache && response.config.method?.toUpperCase() === 'GET') {
    const cacheKey = generateRequestKey(response.config);
    setCacheData(cacheKey, response.data, requestConfig.cacheTime);
  }
  
  // 假设后端返回 { code, data, msg }，只返回业务数据
  const { code, data, msg } = response.data as ResponseData;
  if (code !== 200) {
    return Promise.reject(new Error(msg || '请求失败'));
  }
  return data;
};

// 响应错误处理
export const responseError = async (error: AxiosError) => {
  // 从待处理列表中移除请求
  if (error.config) {
    removePendingRequest(error.config);
  }
  
  // 处理缓存命中情况
  const cachedError = error as CachedAxiosError;
  if (cachedError.__CANCEL__ && cachedError.message === 'Request cached') {
    return Promise.resolve(cachedError.data);
  }
  
  const config = error.config as RequestConfig | undefined;
  
  // 处理重试逻辑
  if (config && config.retry && config.retry > 0) {
    config.retry -= 1;
    
    // 创建延迟函数
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    // 延迟后重试
    await delay(config.retryDelay || 1000);
    // 注意：由于循环依赖问题，我们需要在使用时动态导入 axios
    const axios = (await import('axios')).default;
    return axios(config);
  }
  
  // 错误处理：分层与场景化应对
  if (!error.response) {
    // 无响应：网络错误/断网
    console.error('网络异常，请检查连接');
  } else {
    const { status, data } = error.response;
    switch (status) {
      case 401:
        // token 过期：清除存储并跳转登录
        localStorage.removeItem('token');
        // 在微前端环境中，可能需要通过事件总线通知主应用跳转登录
        window.location.href = '/login';
        break;
      case 403:
        console.error('权限不足，无法访问');
        break;
      case 404:
        console.error('接口不存在');
        break;
      case 500:
        console.error('服务器内部错误');
        break;
      default:
        console.error(`请求错误：${(data as any)?.msg || status}`);
    }
  }
  return Promise.reject(error);
};