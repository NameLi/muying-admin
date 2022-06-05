import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

import user from './modules/user'
import app from './modules/app'
import basic from './modules/basic'
Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		user,
		app,
		basic
	},
	getters
})