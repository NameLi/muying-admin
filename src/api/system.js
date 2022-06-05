import http from '@/http/index'


// 菜单管理
export const getMenus = (params) => http.get('/system/menus', params)
export const createMenu = (params) => http.post('/system/menus', params)
export const updateMenu = (id, params) => http.put(`/system/menus/${id}`, params)
export const deleteMenu = (id) => http.delete(`/system/menus/${id}`)


// 成员管理
export const getAdmins = (params) => http.get('/system/admins', params)
export const createAdmin = (params) => http.post('/system/admins', params)
export const updateAdmin = (id, params) => http.put(`/system/admins/${id}`, params)
export const updateAdminPassword = (id, params) => http.patch(`/system/admins/${id}`, params)
export const deleteAdmin = (id) => http.delete(`/system/admins/${id}`)


// 角色管理
export const getRoles = () => http.get('/system/roles')
export const createRole = (params) => http.post('/system/roles', params)
export const updateRole = (id, params) => http.put(`/system/roles/${id}`, params)
export const deleteRole = (id) => http.delete(`/system/roles/${id}`)


// 角色菜单
export const getRoleMenus = (id) => http.get(`/system/roles/${id}/menus`)
export const updateRoleMenus = (id, params) => http.put(`/system/roles/${id}/menus`, params)
