import axios from "axios";

// 创建axios实例
let APIService: any = {};
APIService = axios.create({
    baseURL: "http://localhost:8080/api", // api的base_url
    timeout: 30000 // 请求超时时间
});

// request拦截器 axios的一些配置
APIService.interceptors.request.use(
    (config: any) => {
        return config;
    },
    (error: any) => {
        // Do something with request error
        // message.error('远程服务不可用，无法加载状态机');
        Promise.reject(error);
    }
);

// respone拦截器 axios的一些配置
APIService.interceptors.response.use(
    (response: any) => {
        return response;
    },
    (error: any) => {
        // message.error('远程服务不可用，无法加载状态机');
        return Promise.reject(error);
    }
);

export default APIService;
