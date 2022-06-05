import http from '@/http/index'


// 视频管理
export const getVideos = (params) => http.get('/videos', params)
export const getVideo = (id, params) => http.get(`/videos/${id}`, params)
export const createVideo = (params) => http.post('/videos', params)
export const updateVideo = (id, params) => http.patch(`/videos/${id}`, params)
export const updateVideoStatus = (id, params) => http.patch(`/videos/${id}/status`, params)
export const deleteVideo = (id, params) => http.delete(`/videos/${id}`, params)

export const getVideoData = (id, params) => http.get(`/videos/${id}/data`, params)   // 获取影视数据统计