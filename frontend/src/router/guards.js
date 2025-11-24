import { getToken } from '../utils/storage.js';

// 认证守卫 - 需要登录的页面
export const requireAuth = (to, from, next) => {
  const token = getToken();
  
  if (!token) {
    // 未登录，重定向到登录页面
    next({
      path: '/login',
      query: { redirect: to.fullPath } // 保存目标路径，登录后跳转
    });
  } else {
    next(); // 已登录，允许访问
  }
};

// 游客守卫 - 已登录用户不能访问登录/注册页面
export const requireGuest = (to, from, next) => {
  const token = getToken();
  
  if (token) {
    // 已登录，重定向到首页
    next({ path: '/' });
  } else {
    next(); // 未登录，允许访问
  }
};

// 路由前置守卫
export const setupRouterGuards = (router) => {
  router.beforeEach((to, from, next) => {
    // 可以在这里添加全局的路由守卫逻辑
    const isAuthenticated = !!getToken();
    
    // 如果需要认证的页面
    if (to.meta.requiresAuth && !isAuthenticated) {
      next('/login');
      return;
    }
    
    // 如果已经是登录状态，不允许访问登录页面
    if (to.meta.requiresGuest && isAuthenticated) {
      next('/');
      return;
    }
    
    next();
  });
};
