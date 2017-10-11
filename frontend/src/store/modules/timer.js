import Vue from 'vue'
import { TIMER } from '../mutation-types'

const actions = {
  [TIMER]({ commit }, payload) {
    commit(TIMER, payload)
  },
}

const mutations = {
  [TIMER](state, payload) {
    Vue.set(state, 'timer', payload.timer)
  },
}


export default {
  actions,
  mutations,
}
