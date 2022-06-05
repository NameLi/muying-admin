import http from '@/http/index'


// 文章管理
export const getArticles = (params) => http.get('/articles', params)
export const getArticle = (id) => http.get(`/articles/${id}`)
export const createArticle = (params) => http.post(`/articles`, params)
export const updateArticle = (id, params) => http.patch(`/articles/${id}`, params)
export const updateArticleSet = (id, params) => http.patch(`/articles/${id}/set`, params)
export const deleteArticle = (id, params) => http.delete(`/articles/${id}`, params)