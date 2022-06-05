import http from '@/http/index'

// 操作日志
export const getActionLogs = (params) => http.get('/logs/actions', params)
export const getActionLog = (id, params) => http.get(`/logs/actions/${id}`, params)

// 系统日志
export const getSystemLogs = (params) => http.get('/logs/systems', params)
