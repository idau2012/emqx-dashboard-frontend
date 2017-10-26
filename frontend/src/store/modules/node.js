import Vue from 'vue'
import { CURRENT_NODE } from '../mutation-types'

// const node = {
//   nodeName: '',
//   nodes: [],
// }

const actions = {
  [CURRENT_NODE]({ commit }, payload) {
    commit(CURRENT_NODE, payload.nodeName)
  },
}

const mutations = {
  [CURRENT_NODE](state, payload) {
    Vue.set(state, 'nodeName', payload)
  },
}


export default {
  mutations,
  actions,
}
