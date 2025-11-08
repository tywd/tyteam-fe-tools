import { baseUrl, getAllRoute, transformRoutes } from '@/utils';
import { createRouter, createWebHistory, RouteRecordRaw, Router } from 'vue-router';
import { useTabsStore } from '../stores/tabs';
import { useMenuStore } from '../stores/menu';

// 基础路由
const baseRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/dashboard.vue'),
    meta: { title: '子应用看板' }
  }
];

// 动态获取的其他所有路由
const _routes: any[] = getAllRoute()
const mainRoutes: RouteRecordRaw[] = transformRoutes(_routes);
const routes: RouteRecordRaw[] = [...baseRoutes, ...mainRoutes];

// 创建路由
const router: Router = createRouter({
  history: createWebHistory(baseUrl),
  routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
  console.log('sub-路由守卫:', to, {
    to: to.path,
    from: from.path,
    fullPath: to.fullPath,
    matched: to.matched.length,
    qiankunEnv: window.__POWERED_BY_QIANKUN__
  })
  const tabsStore = useTabsStore();
  const menuStore = useMenuStore();
  menuStore.mergeMenu(getAllRoute());
  if (to.meta?.title) {
    document.title = `<%= projectName %> - ${to.meta.title}`
    // 设置激活的菜单
    const menuItem = menuStore.findMenuByPath(to.path);
    if (menuItem) {
      menuStore.setActiveMenu(menuItem.id);
      // 添加标签页
      tabsStore.addTab({
        id: menuItem.id,
        name: to.meta.title as string,
        path: to.path,
        closable: to.path !== '/dashboard', // 首页不可关闭
      });
    }
  }
  next()
})

router.afterEach((to) => {
  console.log('子应用路由切换完成:', to.path)
})

export default router;