import {
    UPDATE_DIRECTION,
    SET_HEADER,
    SET_HEADER_transparent,
    SET_HEADER_VISIBLE
} from './mutation-types.js'

import getters from './getters'
const state = {
    direction: 'forward',
    headerProp: {}
}

const mutations = {
    [UPDATE_DIRECTION](state, payload) {
        state.direction = payload.direction
    },
    [SET_HEADER](state, payload) {
        state.headerProp = payload
    },
    [SET_HEADER_transparent](state, payload) {
        state.headerProp.transparent = payload.transparent
    },
    [SET_HEADER_VISIBLE](state, payload) {
        state.headerProp.visible = payload
    }
}

export default {
    state,
    mutations,
    getters
}
