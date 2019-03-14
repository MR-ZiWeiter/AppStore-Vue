import {
    SET_USERINFO,
    SET_LOGIN
} from './mutation-types.js'

import getters from './getters'
const state = {
    userInfo: {},
    isLogin:false
}

const mutations = {
    [SET_USERINFO](state, payload) {
        console.log(payload)
        state.userInfo = payload
    },
    [SET_LOGIN](state, payload) {
        state.isLogin = payload
    }
}

export default {
    state,
    mutations,
    getters
}
