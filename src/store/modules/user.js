import { getAdminToken, getAdminInfo } from '@/api/admin'

const state = {
  token: localStorage.getItem('token') || '',
  admin: localStorage.getItem('admin') ? JSON.parse(localStorage.getItem('admin')) : null,
  menus: localStorage.getItem('menus') ? JSON.parse(localStorage.getItem('menus')) : null,
}

const mutations = {
  // 身份token
  SET_TOKEN: (state, token) => {
    state.token = token
    localStorage.setItem('token', token)
  },
  // 管理员信息
  SET_ADMIN: (state, admin) => {
    state.admin = admin
    localStorage.setItem('admin', JSON.stringify(admin))
  },
  // 管理员权限
  SET_MENUS: (state, menus) => {
    state.menus = menus
    localStorage.setItem('menus', JSON.stringify(menus))
  }
}

const actions = {
  // user login
  async login({ commit }, loginForm) {
    const { account, password } = loginForm

    let res = await getAdminToken({ account: account.trim(), password })
    
    if(res.code === 200) {
      commit('SET_TOKEN', res.data.token) 
    }
    return res
  },

  // get user info
  async getInfo({ commit }) {

    const res = await getAdminInfo();
    
    if(res.code === 200) {
      const { account, nickname, avatar, birthday, created_at, deadline_at, roles } = res.data
      const admin = { account, nickname, avatar, birthday, created_at, deadline_at }

      // roles must be a non-empty array
      if (!roles || roles.length === 0) {
        reject('getAdminInfo: roles must be a non-null array!')
      }

      commit('SET_ADMIN', admin)
      commit('SET_MENUS', roles)
    }

    return res
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
