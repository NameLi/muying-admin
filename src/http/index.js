/**
 * @desc axios 封装 
 */

import axios from 'axios'
import qs from 'qs'
import store from '@/store'
import router from '@/router/index'
import { API_DOMAIN } from '@/config'
import { Message } from 'element-ui'

// axios 配置
axios.defaults.timeout = 60000
axios.defaults.baseURL = API_DOMAIN
axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'


// 请求时的拦截
axios.interceptors.request.use(config => {
	if (store.getters.token) {
		config.headers['Authorization'] = 'Bearer ' + store.getters.token
	}

	return config
}, function (error) {
	return Promise.reject(error)
})

// 返回值
axios.interceptors.response.use(res => {
	switch (res.status) {
		case 200:
		case 201:
			const { code, message } = res.data;
			const method = res.config.method;

			switch (code) {
				case 401:
					Message({
						message,
						type: 'error'
					})

					localStorage.clear()

					if(router.currentRoute.name !== 'Login') {
						router.replace('/login')
					}
					break

				case 200:
					if (['post', 'patch', 'put', 'delete'].includes(method)) {

						// 非登录接口
						if (!res.config.url.includes('login')) {
							Message({
								message: res.data.message,
								type: 'success'
							})
						}
					} else if (method === 'get') {
						// 对 created_at 截取
						if (Array.isArray(res.data.data)) {
							res.data.data.map(item => {
								if (item.created_at) {
									item.created_at = item.created_at.slice(0, 10)
								}
							})
						}
					}

					return res.data

					break;
				default:
					Message({
						message: res.data.message,
						type: 'error'
					})

					return res.data
			}
			break

		case 422:
			Message({
				message: res.data.message,
				type: 'error'
			})

			resolve(res.data)

			break;

		default:
			Message({
				message: res.status + ' ' + res.statusText,
				type: 'error'
			})
	}

	return {
		code: res.status_code,
		message: res.message,
		data: {}
	}

}, error => {
	if (String(error).includes('timeout')) {
		Message.error('网络请求超时')
	} else if (String(error).includes('Network Error')) {
		Message.error('网络异常')
	} else if (error.response) {
		const { status, data } = error.response
		if (status === 401) {
			Message.error('请重新登录')
			localStorage.clear()
			router.replace('/login')
		} else {
			Message.error(status + ' ' + data.message)
		}
	}
	return {
		'code': 400,
		'messsage': 'error'
	}
})


export default {
	get(url, params) {

		if (params) {
			// 只存在排序字段时，则走默认排序
			if (!params.order) {
				delete params.order
				delete params.sortby
			}
			// 删除多余字段
			if (params.total !== undefined) {
				delete params.total
			}

			// 删除无效参数
			for (let param in params) {
				if (params[param] === undefined) {
					delete params[param]
				}
			}
		}

		return axios({
			method: 'get',
			url,
			params
		})
	},

	post(url, data) {
		return axios({
			method: 'post',
			url,
			data
		})
	},

	patch(url, data) {
		return axios({
			method: 'patch',
			url,
			data
		})
	},

	put(url, data) {
		return axios({
			method: 'put',
			url,
			data
		})
	},

	delete(url, data) {
		return axios({
			method: 'delete',
			url,
			data
		})
	}
}