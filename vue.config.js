module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",    //接口
        changeOrigin: false,                 //是否跨域 用于控制请求头中的host值
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  }
}