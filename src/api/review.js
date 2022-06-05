import http from '@/http/index'


// 影评管理
export const getReviews = (params) => http.get(`/reviews`, params)
export const getReview = (id, params) => http.get(`/reviews/${id}`, params)
export const createReview = (id, params) => http.post(`/movies/${id}/reviews`, params)
export const updateReview = (id, params) => http.patch(`/reviews/${id}`, params)
export const deleteReview = (id, params) => http.delete(`/reviews/${id}`, params)