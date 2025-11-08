import { nanoid } from 'nanoid';
// 全局变量：是否在qiankun环境中运行
export const isQiankunEnv = window.__POWERED_BY_QIANKUN__;
// 路由基础路径：在qiankun中时使用主应用配置的activeRule
export const baseUrl = isQiankunEnv ? '/<%= projectName %>' : '/';

// 获取所有路由
export const getAllRoute = () => {
    const routes = [
        {
            id: nanoid(),
            title: '项目模拟',
            path: '/project',
            name: 'project',
            icon: 'User',
            level: 1,
            meta: { title: '项目模拟' },
            children: [
                {
                    id: nanoid(),
                    title: '虚拟列表',
                    path: '/project/virtual-list',
                    name: 'virtualList',
                    icon: 'List',
                    level: 2,
                    parentId: nanoid(),
                    meta: { title: '虚拟列表' }
                }
            ]
        },
    ]
    return routes
}

// 处理原始route路径为 vue-router可用的格式
export const transformRoutes = (routes: any[]): any[] => {
    const newRoutes: any[] = routes.map(route => {
        let transformd: any = {
            path: route.path,
            name: route.name,
            meta: route.meta
        }
        if (route.children && route.children.length > 0) {
            transformd.children = transformRoutes(route.children)
        } else {
            transformd.component = () => import(`@/views${route.path}.vue`)
        }
        return transformd
    })
    return newRoutes;
}

// 处理原始route为菜单格式
export const transformMenu = (routes: any[]): any[] => {
    const menu: any[] = routes.map(route => {
        const transformd: any = {
            id: route.id,
            title: route.title,
            icon: route.icon,
            level: route.level,
            path: route.path,
            parentId: route.parentId
        }
        if (route.children && route.children.length > 0) {
            transformd.children = transformMenu(route.children);
        }
        return transformd
    })
    return menu;
}