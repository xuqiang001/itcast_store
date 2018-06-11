import Vue from 'vue';
import Router from 'vue-router';
// 导入element-ui中的Message方法
// import { Message } from 'element-ui';
// 路由懒加载
// 导入组件
const Login = () => import('@/views/login');
// 导入home组件
const Home = () => import('@/views/home');

const Users = () => import('@/views/users/users');

const Rights = () => import('@/views/roles/rights');

const Roles = () => import('@/views/roles/roles');

const Goods = () => import('@/views/goods/goods');

// 商品分类组件
const Categories = () => import('@/views/goods/categories');

const GoodsAdd = () => import('@/views/goods/goodsadd');

const Params = () => import('@/views/goods/params');

const Orders = () => import('@/views/orders/orders');
const Reports = () => import('@/views/reports/reports');

Vue.use(Router);

const router = new Router({
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
        },
        {
          name: 'roles',
          path: 'roles',
          component: Roles
        },
        {
          name: 'categories',
          path: 'categories',
          component: Categories
        },
        {
          name: 'goods',
          path: 'goods',
          component: Goods
        },
        {
          name: 'goodsadd',
          path: 'goods/add',
          component: GoodsAdd
        },
        {
          name: 'params',
          path: 'params',
          component: Params
        },
        {
          name: 'orders',
          path: 'orders',
          component: Orders
        },
        {
          name: 'reports',
          path: 'reports',
          component: Reports
        }
      ]
    }
  ]
});

// 全局的路由前置守卫
// 在路由跳转之前做的干预
router.beforeEach((to, from, next) => {
  // 判断是否登录
  // 登录页面不需要判断token
  if (to.name === 'login') {
    next();
  } else {
    // 判断时候有token
    const token = sessionStorage.getItem('token');
    if (token) {
      next();
    } else {
      router.push({
        name: 'login'
      });
    }
  }
});

export default router;
