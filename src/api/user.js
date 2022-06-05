import http from '@/http/index'


// 用户管理
export const getUsers = (params) => http.get('/users', params)
export const getUser = (id) => http.get(`/users/${id}`)
export const updateUser = (id, params) => http.patch(`/users/${id}`, params)
export const updateUserSet = (id, params) => http.patch(`/users/${id}/set`, params)       // 用户设置


// 用户相关
export const getUserData = (id, params) => http.get(`/users/${id}/data`)                  // 用户数据
export const getUserMovies = (id, params) => http.get(`/users/${id}/movies`, params)      // 用户创建影视
export const getUserActors = (id, params) => http.get(`/users/${id}/actors`, params)      // 用户创建影人
export const getUserRoles = (id, params) => http.get(`/users/${id}/roles`, params)        // 用户创建角色
export const getUserPhotos = (id, params) => http.get(`/users/${id}/photos`, params)      // 用户相册
export const getUserPhotosCounts = (id) => http.get(`/users/${id}/photos/counts`)         // 相册统计
export const getUserComments = (id, params) => http.get(`/users/${id}/comments`, params)  // 用户评论
export const getUserReviews = (id, params) => http.get(`/users/${id}/reviews`, params)    // 用户影评
export const getUserVideos = (id, params) => http.get(`/users/${id}/videos`, params)      // 用户视频
export const getUserRatings = (id, params) => http.get(`/users/${id}/ratings`, params)    // 用户评分

// 用户反馈
export const getUserFeedbacks = (params) => http.get(`/feedbacks`, params)    // 用户反馈
export const handleFeedback = (id, params) => http.post(`/feedbacks/${id}`, params)   // 处理反馈

// 用户举报
export const getReports = (params) => http.get(`/reports`, params)
export const handleReport = (id, params) => http.post(`/reports/${id}`, params)   // 处理举报