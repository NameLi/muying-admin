const state = {
  app: localStorage.getItem('app') ? JSON.parse(localStorage.getItem('app')) : null,
  loading: !!localStorage.getItem('loading') === "true",
  sidebar: localStorage.getItem('sidebar') === "true",
  role: localStorage.getItem('role') ? JSON.parse(localStorage.getItem('role')) : null,
  alive_routes: localStorage.getItem('alive_routes') ? JSON.parse(localStorage.getItem('alive_routes')) : [],
}

const getters = {

}

const mutations = {
  // 加载状态
  SET_LOADING: (state, loading) => {
    state.loading = loading
    localStorage.setItem('loading', loading)
  },

  // 是否收起二级菜单
  SET_SIDEBAR: (state, sidebar) => {
    state.sidebar = sidebar
    localStorage.setItem('sidebar', sidebar)
  },

  // 设置网站信息
  SET_APP: (state, app) => {
    state.app = app
    localStorage.setItem('app', JSON.stringify(app))
  },

  // 设置角色
  SET_ROLE: (state, role) => {
    state.role = role
    localStorage.setItem('role', JSON.stringify(role))
  },

  // 设置 route tab 路由
  SET_TABS: (state, tabs) => {
    state.tabs = tabs
    localStorage.setItem('tabs', JSON.stringify(tabs))
  },
}

const actions = {
  setLoading({ commit }, loading) {
    commit('SET_LOADING', loading)
  },
  setSidebar({ commit }, toggle) {
    commit('SET_SIDEBAR', toggle)
  },
  setApp({ commit }, app) {
    commit('SET_APP', app)
  },
  setRole({ commit }, role) {
    commit('SET_ROLE', role)
  },
  setTabs({ commit }, tabs) {
    commit('SET_TABS', tabs)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}