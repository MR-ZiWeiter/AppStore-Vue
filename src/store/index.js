import Vue from 'vue'
import Vuex from 'vuex'
import head from './head'
import user from './user'
import config from './config'
import goods from './goods'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		head,
		user,
		config,
		goods
	},
})