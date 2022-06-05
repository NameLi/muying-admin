import http from '@/http/index'

/** 
 * @desc 影人信息相关接口
 */

// 影人基础信息
export const getActors = (params) => http.get('/actors', params)                                // 获取影人列表
export const getSimpleActors = (params) => http.get('/actors/simple', params)                   // 有人基本信息搜索
export const getActor = (id) => http.get(`/actors/${id}`)                                       // 获取影人详情
export const createActor = (params) => http.post(`/actors`, params)                             // 新增影人
export const updateActor = (id, params) => http.patch(`/actors/${id}`, params)                  // 更新影人
export const updateActorSummary = (id, params) => http.patch(`/actors/${id}/summary`, params)   // 更新影人简介
export const updateActorStatus = (id, params) => http.patch(`/actors/${id}/status`, params)     // 更新影人状态
export const deleteActor = (id, params) => http.delete(`/actors/${id}`, params)                 // 删除影人


// 影人关联信息
export const getActorData = (id, params) => http.get(`/actors/${id}/data`, params)              // 获取影人数据统计
export const getActorHistories = (id, params) => http.get(`/actors/${id}/histories`, params);   // 历史记录
export const getActorRoles = (id, params) => http.get(`/actors/${id}/roles`, params)            // 获取影人饰演角色
export const getActorWorks = (id, params) => http.get(`/actors/${id}/works`, params)            // 获取影人作品
export const getActorPhotos = (id, params) => http.get(`/actors/${id}/photos`, params)          // 获取影人相册
export const getActorAwards = (id) => http.get(`/actors/${id}/awards`)                          // 获取影人奖项


// 统计
export const getActorsStatusCount = () => http.get(`/actors/status/count`)    // 影人状态统计
export const getActorsCountryCount = () => http.get(`/actors/country/count`)  // 影人国家/地区统计
export const getActorsYearCount = () => http.get(`/actors/year/count`)        // 影人出生年份统计