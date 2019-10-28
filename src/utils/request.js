import axios from 'axios'
import store from '../store'
import {Message} from 'element-ui'


// 统一配置
let rainbowAxios = axios.create({
    baseURL: 'http://127.0.0.1:8088/',
    responseType: 'json',
    validateStatus(status) {
        // 200 外的状态码都认定为失败
        return status === 200
    }
})

// 拦截请求
rainbowAxios.interceptors.request.use((config) => {
    // 有 token就带上
    if (store.state.token) {
        config.headers.Authorization = store.state.token
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

// 拦截响应
rainbowAxios.interceptors.response.use((config) => {
    return config
}, (error) => {
    if (error.response) {
        let errorMessage = error.response.data === null ? '系统内部异常，请联系网站管理员' : error.response.data.message
        switch (error.response.status) {
            case 404:
               Message.error({message: '很抱歉，资源未找到!'});

                break
            case 403:
            case 401:
                 Message.error({message: '很抱歉，您无法访问该资源，可能是因为没有相应权限或者登录已失效!'});
                break
            default:
            Message.error({message: errorMessage});
                break
        }
    }
    return Promise.reject(error)
})

// 封装axios请求
const request = {
    post(url, params) {
        return rainbowAxios.post(url, params, {
            transformRequest: [(params) => {
                let result = ''
                Object.keys(params).forEach((key) => {
                    if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
                        result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
                    }
                })
                return result
            }],
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    },
    put(url, params) {
        return rainbowAxios.put(url, params, {
            transformRequest: [(params) => {
                let result = ''
                Object.keys(params).forEach((key) => {
                    if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
                        result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
                    }
                })
                return result
            }],
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    },
    get(url, params) {
        let _params
        if (Object.is(params, undefined)) {
            _params = ''
        } else {
            _params = '?'
            for (let key in params) {
                if (params.hasOwnProperty(key) && params[key] !== null) {
                    _params += `${key}=${params[key]}&`
                }
            }
        }
        return rainbowAxios.get(`${url}${_params}`)
    },
    delete(url, params) {
        let _params
        if (Object.is(params, undefined)) {
            _params = ''
        } else {
            _params = '?'
            for (let key in params) {
                if (params.hasOwnProperty(key) && params[key] !== null) {
                    _params += `${key}=${params[key]}&`
                }
            }
        }
        return rainbowAxios.delete(`${url}${_params}`)
    }

   
}

export default request
