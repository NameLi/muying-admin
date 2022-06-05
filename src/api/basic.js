import http from '@/http/index'

/**
 * @desc 基础信息 
 */


// 公司信息
export const getCompanies = (params) => http.get(`/companies`, params)
export const getSimpleCompanies = (params) => http.get(`/companies/simple`, params)
export const getCompany = (id) => http.get(`/companies/${id}`)
export const createCompany = (params) => http.post(`/companies`, params)
export const updateCompany = (id, params) => http.patch(`/companies/${id}`, params)
export const deleteCompany = (id, params) => http.delete(`/companies/${id}`, params)


// 影视类型
export const getGenres = (params) => http.get(`/genres`, params)
export const getGenresSimple = (params) => http.get(`/genres/simple`, params)
export const createGenre = (params) => http.post(`/genres`, params)
export const updateGenresSort = (params) => http.patch(`/genres/sort`, params)
export const updateGenre = (id, params) => http.patch(`/genres/${id}`, params)
export const deleteGenre = (id, params) => http.delete(`/genres/${id}`, params)


// 影人职务
export const getProfessions = (params) => http.get(`/professions`, params)
export const getProfessionsSimple = (params) => http.get(`/professions/somple`, params)
export const createProfession = (params) => http.post(`/professions`, params)
export const updateProfessionsSort = (params) => http.patch(`/professions/sort`, params)
export const updateProfession = (id, params) => http.patch(`/professions/${id}`, params)
export const deleteProfession = (id, params) => http.delete(`/professions/${id}`, params)


// 国家管理
export const getCountries = (params) => http.get(`/countries`, params)
export const getSimpleCountries = (params) => http.get(`/countries/simple`, params)
export const getCountry = (id) => http.get(`/countries/${id}`)
export const createCountry = (params) => http.post(`/countries`, params)
export const updateCountriesSort = (params) => http.patch(`/countries/sort`, params)
export const updateCountry = (id, params) => http.patch(`/countries/${id}`, params)
export const deleteCountry = (id, params) => http.delete(`/countries/${id}`, params)


// 语言管理
export const getLanguages = (params) => http.get(`/languages`, params)
export const getSimpleLanguages = (params) => http.get(`/languages/simple`, params)
export const getLanguage = (id) => http.get(`/languages/${id}`)
export const createLanguage = (params) => http.post(`/languages`, params)
export const updateLanguage = (id, params) => http.patch(`/languages/${id}`, params)
export const deleteLanguage = (id, params) => http.delete(`/languages/${id}`, params)


// 家长引导
export const getLevels = (params) => http.get(`/levels`, params)
export const getSimpleLevels = (params) => http.get(`/levels/simple`, params)
export const getSortLevels = (params) => http.get(`/levels/sort`, params)
export const getLevel = (id) => http.get(`/levels/${id}`)
export const createLevel = (params) => http.post(`/levels`, params)
export const updateLevel = (id, params) => http.patch(`/levels/${id}`, params)
export const updateLevelsCountrySort = (params) => http.patch(`/levels/countries/sort`, params)
export const updateLevelsSort = (params) => http.patch(`/levels/sort`, params)
export const deleteLevel = (id, params) => http.delete(`/levels/${id}`, params)


// banner
export const getBanners = (params) => http.get(`/banners`, params)
export const getBanner = (id) => http.get(`/banners/${id}`)
export const createBanner = (params) => http.post(`/banners`, params)
export const updateBanner = (id, params) => http.patch(`/banners/${id}`, params)
export const updateBannerStatus = (id, params) => http.patch(`/banners/${id}/status`, params)
export const updateBannersSort = (params) => http.patch(`/banners/sort`, params)
export const deleteBanner = (id, params) => http.delete(`/banners/${id}`, params)
