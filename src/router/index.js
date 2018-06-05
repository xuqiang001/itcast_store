import Vue from 'vue';
import Router from 'vue-router';

// 导入组件
import Login from '@/views/login';
// 导入home组件
import Home from '@/views/home';

import Users from '@/views/users/users';

import Rights from '@/views/roles/rights';
Vue.use(Router);

export default new Router({
  routes: [
    { name: 'login', path: '/login', component: Login },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        // 子路由
        {
          name: 'users',
          path: 'users',
          component: Users
        },
        {
          name: 'rights',
          path: 'rights',
          component: Rights
        }
      ]
    }
  ]
});
