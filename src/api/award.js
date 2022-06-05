import http from '@/http/index'

/**
 * @desc 影视奖项相关接口
 */


// 奖项基本信息
export const getAwards = params => http.get('/awards', params)
export const getAward = (id, params) => http.get(`/award/${id}`, params)
export const createAward = params => http.post(`/awards`, params)
export const updateAwardsSort = (params) => http.patch(`/awards/sort`, params)
export const updateAward = (id, params) => http.patch(`/awards/${id}`, params)
export const deleteAward = (id, params) => http.delete(`/awards/${id}`, params)


// 奖项类型
export const getAwardTypes = id => http.get(`/awards/${id}/types`)
export const createAwardType = (id, params) => http.post(`/awards/${id}/types`, params)
export const updateAwardType = (id, type_id, params) => http.patch(`/awards/${id}/types/${type_id}`, params)
export const updateAwardTypesSort = (id, params) => http.patch(`/awards/${id}/types/sort`, params)
export const deleteAwardType = (id, type_id, params) => http.delete(`/awards/${id}/types/${type_id}`, params)


// 奖项届
export const getAwardSessions = (id, params) => http.get(`/awards/${id}/sessions`, params)
export const createAwardSession = (id, params) => http.post(`/awards/${id}/sessions`, params)
export const updateAwardSession = (id, session_id, params) => http.patch(`/awards/${id}/sessions/${session_id}`, params)
export const deleteAwardSession = (id, session_id) => http.delete(`/awards/${id}/sessions/${session_id}`)


// 奖项届详情
export const getAwardSessionDetails = (id, session_id, params) => http.get(`/awards/${id}/sessions/${session_id}/details`, params)
export const createAwardSessionDetail = (id, session_id, params) => http.post(`/awards/${id}/sessions/${session_id}/details`, params)
export const updateAwardSessionDetail = (id, session_id, detail_id, params) => http.patch(`/awards/${id}/sessions/${session_id}/details/${detail_id}`, params)
export const deleteAwardSessionDetail = (id, session_id, detail_id) => http.delete(`/awards/${id}/sessions/${session_id}/details/${detail_id}`)

