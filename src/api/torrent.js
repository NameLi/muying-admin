import http from '@/http/index'


// 种子管理
export const getTorrents = (params) => http.get('/torrents', params)
export const getTorrent = (id, params) => http.get(`/torrents/${id}`, params)
export const createTorrent = (id, params) => http.post(`/movies/${id}/torrents`, params)
export const updateTorrent = (id, params) => http.patch(`/torrents/${id}`, params)
export const deleteTorrent = (id) => http.delete(`/torrents/${id}`)