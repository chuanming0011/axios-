import axios from './index.js';


/**
 * multipart/form-data
 */
 export const register0 = () => {


  return axios({
    url: "/register",
    method: "post",
    data: {
      name: 'jane',
      password: '123'
    }
  })
}
 export const register01 = () => {


  return axios({
    url: "/register1",
    method: "post",
    data: {
      name: 'jane',
      password: '123'
    }
  })
}
/**
 * application/x-www-form-urlencoded
 */
import qs from "qs";
export const register = () => {
  return axios({
    url: "/register",
    method: "post",
    data: qs.stringify({
      name: 'jane',
      password: '123'
    })
  })
}
/**
 * multipart/form-data
 */
export const register1 = () => {

  let testData = new FormData();
  testData.append('name',"jane")
  testData.append('password',"123")

  return axios({
    url: "/register",
    method: "post",
    data: testData
  })
}