import Vue from 'vue'

import { LANGUAGE_SWITCH } from '../mutation-types'

const language = localStorage.getItem('language') || 'zh-cn'

const actions = {
  [LANGUAGE_SWITCH]({ commit }, payload) {
    localStorage.setItem('language', payload.language)
    commit(LANGUAGE_SWITCH, payload)
  },
}

const mutations = {
  [LANGUAGE_SWITCH](state, payload) {
    // Object.assign(state, payload)
    Vue.set(state, 'language', payload.language)
  },
}

export default {
  language,
  actions,
  mutations,
}
