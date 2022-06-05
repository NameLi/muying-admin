import http from '@/http/index'

/**
 * @desc 影视相关接口
 */

// 影视基础信息
export const getMovies = (params) => http.get('/movies', params)                                // 获取影视列表
export const getMovie = (id, params) => http.get(`/movies/${id}`, params)                       // 获取影视详情
export const createMovie = (params) => http.post(`/movies`, params)                             // 新增影视
export const updateMovie = (id, params) => http.patch(`/movies/${id}`, params)                  // 更新影视
export const updateMovieStatus = (id, params) => http.patch(`/movies/${id}/status`, params)     // 更新影视状态
export const updateMovieRelease = (id, params) => http.post(`/movies/${id}/release`, params)    // 更新上映信息
export const deleteMovie = (id, params) => http.delete(`/movies/${id}`, params)                 // 删除影视

export const getMovieData = (id, params) => http.get(`/movies/${id}/data`, params)              // 获取影视数据
export const getMovieRatingData = (id, params) => http.get(`/movies/${id}/rating`, params)      // 获取影视评分数据


// 影视关联信息
export const getMovieHistories = (id, params) => http.get(`/movies/${id}/histories`, params);   // 历史记录
export const getSimpleMovies = (params) => http.get('/movies/simple', params)                   // 获取影视基础信息列表接口
export const getMovieCast = (id, params) => http.get(`/movies/${id}/cast`, params)	            // 获取演员表
export const updateMovieCastSort = (id, params) => http.patch(`/movies/${id}/cast/sort`, params)	// 更新角色排序
export const getMovieVideos = (id, params) => http.get(`/movies/${id}/videos`, params)	        // 获取短视频
export const getMovieTorrents = (id, params) => http.get(`/movies/${id}/torrents`, params)	    // 获取种子
export const getMoviePhotos = (id, params) => http.get(`/movies/${id}/photos`, params)	        // 获取影视相册
export const getMoviePhotosCounts = (id) => http.get(`/movies/${id}/photos/counts`)		        // 获取影视相册统计
export const getMovieComments = (id, params) => http.get(`/movies/${id}/comments`, params)	    // 获取影视评论
export const getMovieReviews = (id, params) => http.get(`/movies/${id}/reviews`, params)	    // 获取影视长评列表
export const getMovieRoles = (id, params) => http.get(`/movies/${id}/roles`, params)	        // 获取角色列表
export const updateMovieRolesSort = (id, params) => http.patch(`/movies/${id}/roles/sort`, params)	// 获取角色列表
export const getMovieAwards = (id) => http.get(`/movies/${id}/awards`)                          // 获取影视奖项


// 上映日期
export const getMoviePubdates = (id, params) => http.get(`/movies/${id}/pubdates`, params)
export const createMoviePubdate = (id, params) => http.post(`/movies/${id}/pubdates`, params)
export const updateMoviePubdate = (id, pubdate_id, params) => http.patch(`/movies/${id}/pubdates/${pubdate_id}`, params)
export const deleteMoviePubdate = (id, pubdate_id, params) => http.delete(`/movies/${id}/pubdates/${pubdate_id}`, params)


// 家长指导
export const getMovieLevels = (id, params) => http.get(`/movies/${id}/levels`, params)
export const createMovieLevel = (id, params) => http.post(`/movies/${id}/levels`, params)
export const updateMovieLevel = (id, union_id, params) => http.patch(`/movies/${id}/levels/${union_id}`, params)
export const deleteMovieLevel = (id, union_id) => http.delete(`/movies/${id}/levels/${union_id}`)


// 幕后知识
export const getMovieKnowledges = (id, params) => http.get(`/movies/${id}/knowledges`, params)
export const createMovieKnowledge = (id, params) => http.post(`/movies/${id}/knowledges`, params)
export const updateMovieKnowledge = (id, knowledge_id, params) => http.patch(`/movies/${id}/knowledges/${knowledge_id}`, params)
export const deleteMovieKnowledge = (id, knowledge_id, params) => http.delete(`/movies/${id}/knowledges/${knowledge_id}`, params)


// 经典台词
export const getMovieDialogues = (id, params) => http.get(`/movies/${id}/dialogues`, params)
export const createMovieDialogue = (id, params) => http.post(`/movies/${id}/dialogues`, params)
export const updateMovieDialogue = (id, dialogue_id, params) => http.patch(`/movies/${id}/dialogues/${dialogue_id}`, params)
export const deleteMovieDialogue = (id, dialogue_id, params) => http.delete(`/movies/${id}/dialogues/${dialogue_id}`, params)


// 影视关联公司
export const getMovieCompanies = (id, params) => http.get(`/movies/${id}/companies`, params)
export const createMovieCompany = (id, params) => http.post(`/movies/${id}/companies`, params)
export const updateMovieCompany = (id, union_id, params) => http.patch(`/movies/${id}/companies/${union_id}`, params)
export const deleteMovieCompany = (id, union_id, params) => http.delete(`/movies/${id}/companies/${union_id}`, params)


// 影视演员
export const getMovieCastCount = (id, params) => http.get(`/movies/${id}/cast/count`, params)                // 演员分类统计
export const createMovieCast = (id, params) => http.post(`/movies/${id}/cast`, params)                       // 新增演员
export const updateMovieCast = (id, cast_id, params) => http.patch(`/movies/${id}/cast/${cast_id}`, params)  // 更新演员
export const deleteMovieCast = (id, cast_id, params) => http.delete(`/movies/${id}/cast/${cast_id}`, params) // 删除演员


// 影视统计
export const getMoviePhotosCount = (id, params) => http.get(`/movies/${id}/photos/count`, params) // 影视相册分类统计
export const getMoviesStatusCount = () => http.get(`/movies/status/count`)      // 影视状态统计
export const getMoviesCountryCount = () => http.get(`/movies/country/count`)    // 影视国家/地区分布统计
export const getMoviesYearCount = () => http.get(`/movies/year/count`)          // 影视年代统计