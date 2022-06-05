import http from '@/http/index'

export const createUnion = (params) => http.post(`/unions`, params)
export const updateUnion = (id, params) => http.patch(`/unions/${id}`, params)
export const updateUnionSort = (params) => http.patch(`/unions/sort`, params)
export const deleteUnion = (id, params) => http.delete(`/unions/${id}`, params)

