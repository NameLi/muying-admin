import { getProfessions } from '@/api/basic'

const state = {
  professions: localStorage.getItem('professions') ? JSON.parse(localStorage.getItem('professions')) : [],
}

const getters = {

}

const mutations = {
  SET_COUNTRIES: (state, countries) => {
    state.countries = countries
    localStorage.setItem('countries', JSON.stringify(countries))
  },

  SET_PROFESSIONS: (state, professions) => {
    state.professions = professions
    localStorage.setItem('professions', JSON.stringify(professions))
  },
}

const actions = {
  async getProfessions({ commit }) {
    let res = await getProfessions()

    if (res.code === 200) {
      commit('SET_PROFESSIONS', res.data)
    }
    return res
  },
}

export default {
  namespaced: true,
  state,
  // getters,
  actions,
  mutations
}