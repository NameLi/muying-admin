import http from '@/http/index'

// 照片
export const getPhotos = (params) => http.get(`/photos`, params)                                // 获取图片
export const getTypePhotos = (type, id, params) => http.get(`${type}/${id}/photos`, params)     // 获取个类型资源图片
export const updatePhotoStatus = (id, params) => http.patch(`/photos/${id}/status`, params)     // 更新图片状态
export const batchUpdatePhotoStatus = (params) => http.post(`/photos/batch`, params)            // 图片批量处理
export const deletePhoto = (id, params) => http.delete(`/photos/${id}`, params)                 // 删除图片
export const batchDeletePhotos = (params) => http.delete(`/photos/batch`, params)               // 批量删除图片
