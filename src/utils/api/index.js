import axios from "axios";
import store from "/src/store"
const CancelToken = axios.CancelToken;


const myAxios = config =>{
  const service = axios.create({
    baseURL: '/api',    //设置统一请求前缀
    timeout: 10000,                      //请求超时时长
    headers: {
      'Content-Type': 'application/json',                  // 默认 JSON.stringify
      // 'Content-Type': 'application/x-www-form-urlencoded',    // post的data需要引入qs.stringify进行序列化 后端用from接收（python）
      // 'Content-Type': 'multipart/form-data',                    //fomrData
    },
  })


  // 请求拦截器
  service.interceptors.request.use(
    config =>{
      console.log('request',config);
      removePending(config);
      addPendingMap(config);
      // store.commit("changeLoading",true);
      config.headers.testData = "test data" 
      return config
    },
    error =>{
      return Promise.reject(error)
    }
  )

  // 响应拦截器
  service.interceptors.response.use(
    response  =>{
      // console.log('response',response );
      removePending(response.config);
      store.commit("changeLoading",false);
      return response.data 
    },
    error =>{
      store.commit("changeLoading",false);
      error.config && removePending(error.config);
      httpErrorHandler(error)
      return Promise.reject(error)
    }
  )

  return service(config);
}


export default myAxios;


const pendingMap = new Map();
/**
 * 请求地址、请求方式、请求参数为重复请求 key是唯一的 map的key可以是任意形式
 * @param{*} config
 * @return string
 */

const outPendingKey = config =>{
  let { url, method, params , data } = config;
  data = typeof data === "string" ? JSON.parse(data) : data;

  return [url,method,params,JSON.stringify(data)].join("&")
}


/**
 * 存储请求用于取消请求
 * @param{*} config
 */
const addPendingMap = config =>{
  const pendingKey = outPendingKey(config);
  config.cancelToken = config.cancelToken || new CancelToken((c)=>{
    if(!pendingMap.has(pendingKey)){
      pendingMap.set(pendingKey,c)
    }
  })
}


/**
 * 删除重复请求
 * @param{*} config
 */
const removePending = config =>{
  const pendingKey = outPendingKey(config);
  if(pendingMap.has(pendingKey)){
    const cancelToken = pendingMap.get(pendingKey);
    cancelToken(pendingKey);
    pendingMap.delete(pendingKey);
  }
}


/**
 * 处理异常
 * @param{*} error
 */
const httpErrorHandler = error=>{
  if(axios.isCancel(error)) return console.error('请求的重复请求：' + error.message);
  let message = '';
  if (error && error.response) {
    switch(error.response.status) {
      case 302: message = '接口重定向了！';break;
      case 400: message = '参数不正确！';break;
      case 401: message = '您未登录，或者登录已经超时，请先登录！';break;
      case 403: message = '您没有权限操作！'; break;
      case 404: message = `请求地址出错: ${error.response.config.url}`; break; // 在正确域名下
      case 408: message = '请求超时！'; break;
      case 409: message = '系统已存在相同数据！'; break;
      case 500: message = '服务器内部错误！'; break;
      case 501: message = '服务未实现！'; break;
      case 502: message = '网关错误！'; break;
      case 503: message = '服务不可用！'; break;
      case 504: message = '服务暂时无法访问，请稍后再试！'; break;
      case 505: message = 'HTTP版本不受支持！'; break;
      default: message = '异常问题，请联系管理员！'; break
    }
  }
  if (error.message.includes('timeout')) message = '网络请求超时！';
  if (error.message.includes('Network')) message = window.navigator.onLine ? '服务端异常！' : '您断网了！';

  alert(message)

}