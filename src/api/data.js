import http from '@/http/index'

// 数据汇总
export const getDataSummary = () => http.get('/data/summary')
export const getDataDays = (params) => http.get('/data/days', params)
export const getDataRatings = (params) => http.get('/data/ratings', params)
export const getDataMovies = (params) => http.get('/data/movies', params)
export const getDataActors = (params) => http.get('/data/actors', params)
export const getDataGenres = (params) => http.get('/data/genres', params)
export const getDataYears = (params) => http.get('/data/years', params)
export const getDataCountries = (params) => http.get('/data/countries', params)
export const getDataProfessions = (params) => http.get('/data/professions', params)
export const getUsersData = () => http.get('/users/data')
