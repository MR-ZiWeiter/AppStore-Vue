import {
    SET_GOODINFO,
    SET_GOODCHECK,
    SET_GOODNUM
} from './mutation-types.js'

import getters from './getters'
const state = {
    info: {},
    checkInfo:{},
    num:1
}

const mutations = {
    [SET_GOODINFO](state, payload) {
        state.info = payload
    },
    [SET_GOODCHECK](state, payload) {
        state.checkInfo = payload
    },
    [SET_GOODNUM](state, payload) {
        state.num = payload
    },
}

export default {
    state,
    mutations,
    getters
}
