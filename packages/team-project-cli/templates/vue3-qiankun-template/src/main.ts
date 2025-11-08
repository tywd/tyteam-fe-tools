import { createApp, App as VueApp } from 'vue';
import type { Component } from 'vue';
import App from './App.vue';
import router from './router'
import { createPinia } from 'pinia';
import { isQiankunEnv } from './utils';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import '@/styles/index.scss';

// 应用实例和路由实例
let app: VueApp | null = null;

// 创建Pinia实例
const pinia = createPinia()

// 初始化应用
function initApp(container: HTMLElement | string) {
  // 创建应用
  app = createApp(App);
  app.use(router).use(pinia).use(ElementPlus);

  // 注册Element Plus图标
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component as Component);
  }
  app.mount(container instanceof HTMLElement ? container : document.querySelector('micro-app-container') || '#app');
}

// 单独运行时直接初始化
if (!isQiankunEnv) {
  initApp('#app');
}

// 1. 启动钩子（只会在子应用第一次加载时调用）
export async function bootstrap() {
  console.log('<%= projectName %> bootstrap');
}

// 2. 挂载钩子（每次进入子应用时调用）
export async function mount(props: any) {
  console.log('<%= projectName %> mount，接收主应用参数：', props);

  // 处理publicPath（qiankun要求）
  if (window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__) {
    // @ts-ignore
    __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
  }

  // 挂载应用到主应用提供的容器
  initApp(props.container ? props.container.querySelector('#app') : '#app');

  // 监听主应用全局状态
  if (props.onGlobalStateChange) {
    props.onGlobalStateChange((state: any) => {
      console.log('<%= projectName %>接收全局状态变化：', state);
      // 可以在这里更新子应用状态
    }, true);
  }
}

// 3. 卸载钩子（每次离开子应用时调用）
export async function unmount() {
  console.log('<%= projectName %> unmount');
  if (app) {
    app.unmount();
  }
  // if (router) {
  //   router = null;
  // }
  app = null;
}

// 4. 可选：更新钩子（主应用主动调用更新时）
export async function update(props: any) {
  console.log('<%= projectName %> update，参数：', props);
}