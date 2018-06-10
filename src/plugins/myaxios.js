import axios from 'axios';
import { Message } from 'element-ui';
const myaxios = {};
myaxios.install = function (Vue) {
  const instance = axios.create({
    baseURL: 'http://localhost:8888/api/private/v1/',
    timeout: 1000
    // headers: {'X-Custom-Header': 'foobar'}
  });

  // 设置axios的拦截器
  // Add a request interceptor
  instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    // 请求的拦截器，发送请求之前执行
    // 排除掉登录接口，请求登录接口的时候不需要加token
    if (config.url.toLowerCase() !== 'login') {
      // 如果是其它接口，要携带token
      const token = sessionStorage.getItem('token');
      config.headers.Authorization = token;
    }

    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  // Add a response interceptor
  instance.interceptors.response.use(function (response) {
    // 当获取到服务器的响应之后，并且再交给请求动作之前
    // console.log(response);
    const { data: { meta: { status, msg } } } = response;

    // 针对不同的错误码，可以做不同的提示
    // if (status === 400) {
    //
    // } else if (status === 404) {
    // }
    if (status !== 200 && status !== 201) {
      Message.error(msg);
    }

    // Do something with response data
    return response;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
  });

  // 设置Vue实例的属性
  Vue.prototype.$http = instance;
};
export default myaxios;
