import http from '@/http/index'

// 角色基础
export const getRoles = params => http.get('/roles', params)
export const getSimpleRoles = params => http.get('/roles/simple', params)
export const getRole = id => http.get(`/roles/${id}`)
export const createRole = (params) => http.post(`/roles`, params)
export const updateRole = (id, params) => http.patch(`/roles/${id}`, params)
export const updateRoleStatus = (id, params) => http.patch(`/roles/${id}/status`, params)
export const deleteRole = (id, params) => http.delete(`/roles/${id}`, params)


// 角色相关
export const getRoleData = (id, params) => http.get(`/roles/${id}/data`, params)   // 获取角色数据统计
export const getRoleHistories = (id, params) => http.get(`/roles/${id}/histories`, params);  // 历史记录
export const getRoleActors = (id, params) => http.get(`/roles/${id}/actors`, params)
export const getRoleMovies = (id, params) => http.get(`/roles/${id}/movies`, params)
export const getRolePhotos = (id, params) => http.get(`/roles/${id}/photos`, params)
export const getRoleComments = (id, params) => http.get(`/roles/${id}/comments`, params)

