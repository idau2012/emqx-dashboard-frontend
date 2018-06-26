import Vue from 'vue'
import Vuex from 'vuex'

import dictCode from '~/template'

Vue.use(Vuex)

function safeParse(jsonText) {
  try {
    return JSON.parse(jsonText)
  } catch (e) {
    return null
  }
}

const state = {
  loading: false,
  user: safeParse(sessionStorage.getItem('user')) || safeParse(localStorage.getItem('user')) || {},
  nodeName: '',
  dictCode,
}

// login & logout
const USER_LOGIN = 'USER_LOGIN'
// ajax state
const LOADING = 'LOADING'
// current node name in cluster
const CURRENT_NODE = 'CURRENT_NODE'
const SET_DICT_CODE = 'SET_DICT_CODE'

const actions = {
  [USER_LOGIN]({ commit }, payload) {
    if (payload.isLogOut) {
      sessionStorage.removeItem('user')
      localStorage.removeItem('user')
      commit(USER_LOGIN, payload)
      return
    }
    if (payload.remember) {
      localStorage.setItem('user', JSON.stringify(payload.user))
    } else {
      sessionStorage.setItem('user', JSON.stringify(payload.user))
    }
    commit(USER_LOGIN, payload)
  },
  [CURRENT_NODE]({ commit }, nodeName) {
    commit(CURRENT_NODE, nodeName)
  },
  [LOADING]({ commit }, loading = false) {
    commit(LOADING, loading)
  },
  [SET_DICT_CODE]({ commit }, _dictCode = {}) {
    const data = { ...dictCode, ..._dictCode }
    localStorage.setItem('dictCode', JSON.stringify(data))
    commit(SET_DICT_CODE, data)
  },
}

const mutations = {
  [USER_LOGIN](state, payload) {
    if (payload.isLogOut) {
      Vue.set(state, 'user', {})
    } else {
      Vue.set(state, 'user', payload.user)
    }
  },
  [CURRENT_NODE](state, nodeName) {
    Vue.set(state, 'nodeName', nodeName)
  },
  [LOADING](state, loading) {
    state.loading = loading
  },
  [SET_DICT_CODE](state, dictCode) {
    Vue.set(state, 'dictCode', dictCode)
  },
}

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state,
  actions,
  mutations,
})
