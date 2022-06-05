import http from '@/http/index'


// 评论信息
export const getComments = (params) => http.get(`/comments`, params)                            // 获取评论
export const getComment = (id) => http.get(`/comments/${id}`)                                   // 获取评论详情
export const createComment = (id, params) => http.post(`/comments/${id}`, params)               // 获取评论详情
export const deleteComment = (id, params) => http.delete(`/comments/${id}`, params)             // 删除评论

export const getTypeComments = (type, id, params) => http.get(`/${type}/${id}/comments`, params)      // 获取影视评论

// 关联评论
export const getMovieComments = (id, params) => http.get(`/movies/${id}/comments`, params)      // 获取影视评论
export const getActorComments = (id, params) => http.get(`/actors/${id}/comments`, params)      // 获取影人评论
export const getRoleComments = (id, params) => http.get(`/roles/${id}/comments`, params)        // 获取角色评论
export const getReviewComments = (id, params) => http.get(`/reviews/${id}/comments`, params)    // 获取影评评论
export const getArticleComments = (id, params) => http.get(`/articles/${id}/comments`, params)  // 获取文章评论
export const getVideoComments = (id, params) => http.get(`/videos/${id}/comments`, params)      // 获取视频评论
export const getPhotoComments = (id, params) => http.get(`/photos/${id}/comments`, params)      // 获取照片评论
export const getTorrentComments = (id, params) => http.get(`/torrents/${id}/comments`, params)  // 获取种子评论

