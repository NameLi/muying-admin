import http from '@/http/index'

export const getQiniuUpToken = params => http.get("/qiniu/uptoken", params)	// 七牛文件上传token
export const getMixSearch = params => http.get('/search', params)			// 聚合搜索



