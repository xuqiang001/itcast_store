import Vue from 'vue';
import Router from 'vue-router';

// 导入组件
import Login from '@/views/login';

Vue.use(Router);

export default new Router({
  routes: [
    { name: 'l', path: '/', redirect: { name: 'login' } },
    { name: 'login', path: '/login', component: Login }
  ]
});
