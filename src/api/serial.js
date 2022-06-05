import http from '@/http/index'


// 系列基础信息
export const getSerials = (params) => http.get('/serials', params)
export const getSimpleSerials = (params) => http.get('/serial/simple', params)
export const getSerial = (id) => http.get(`/serial/${id}`)
export const createSerial = (params) => http.post(`/serials`, params)
export const updateSerial = (id, params) => http.patch(`/serials/${id}`, params)
export const deleteSerial = (id, params) => http.delete(`/serials/${id}`, params)



// 系列影视
export const getSerialMovies = (id, params) => http.get(`/serials/${id}/movies`, params)
export const getSerialMovie = (id, union_id) => http.get(`/serials/${id}/movies/${union_id}`)
export const createSerialMovie = (id, params) => http.post(`/serials/${id}/movies`, params)
export const updateSerialMovie = (id, union_id, params) => http.patch(`/serials/${id}/movies/${union_id}`, params)
export const deleteSerialMovie = (id, union_id, params) => http.delete(`/serials/${id}/movies/${union_id}`, params)
