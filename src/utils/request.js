import { message } from 'antd';
import axios from 'axios'
import {hasToken,getToken, removeToken} from 'utils/storage'
import history from 'utils/history'
export const baseURL = 'http://geek.itheima.net/v1_0'
const instance = axios.create({
    baseURL:baseURL,
    timeout:5000,

})

instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if (hasToken()){
    config.headers.Authorization = 'Bearer '+ getToken()
  }
  
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});


instance.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么

    return response.data;
  }, function (error) {
    if(!error.response){
      return Promise.reject(new Error('网络异常'))
    }
    if(error.response.status===401){
      // 代表token过期了
      // 1.删除token
      removeToken()
      message.warn('登录信息过期了')
      // 跳转登录页面
      // window.location.href = '/login'
      history.push({pathname:'/login',state:{from:window.location.pathname}})
      // history.push('/login')

    }
   
    return Promise.reject(error);
  });

export default instance