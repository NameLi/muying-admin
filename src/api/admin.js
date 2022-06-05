import http from '@/http/index'


// 当前管理员信息
export const getAdminToken = (params) => http.post('/login', params)  // 管理员登录
export const getAdminInfo = () => http.get(`/admin/info`)             // 当前管理员信息
export const getAdminMenu = () => http.get(`/admin/menus`)            // 管理员权限菜单
export const updateAdmin = (params) => http.patch('/admin', params)   // 更新当前管理员信息
export const updateAdminPassword = (params) => http.patch('/admin/password', params)  // 更新密码
