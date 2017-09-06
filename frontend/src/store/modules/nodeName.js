import { CURRENT_NODE } from '../mutation-types'


const actions = {
  [CURRENT_NODE]({ commit }, payload) {
    commit(CURRENT_NODE, payload.nodeName)
  },
}

const mutations = {
  [CURRENT_NODE](moduleState, nodeName) {
    Object.assign(moduleState, nodeName)
  },
}


export default {
  actions,
  mutations,
}
