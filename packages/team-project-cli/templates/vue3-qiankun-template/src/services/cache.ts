// 缓存服务
import { CacheItem } from './types';

// 缓存对象
const cacheMap = new Map<string, CacheItem>();

// 检查缓存是否有效
export const isCacheValid = (cacheTime: number, timestamp: number): boolean => {
  return Date.now() - timestamp < cacheTime;
};

// 获取缓存数据
export const getCacheData = (key: string, cacheTime: number = 300000): any => {
  const cacheItem = cacheMap.get(key);
  if (cacheItem && isCacheValid(cacheTime, cacheItem.timestamp)) {
    return cacheItem.data;
  }
  return null;
};

// 设置缓存数据
export const setCacheData = (key: string, data: any, cacheTime: number = 300000): void => {
  cacheMap.set(key, {
    data,
    timestamp: Date.now()
  });
  
  // 设置过期定时器
  setTimeout(() => {
    cacheMap.delete(key);
  }, cacheTime);
};

// 清除所有缓存
export const clearAllCache = (): void => {
  cacheMap.clear();
};