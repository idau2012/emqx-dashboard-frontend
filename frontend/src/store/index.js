import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import node from './modules/node'
import getters from './getters'
import themes from './modules/themes'
import language from './modules/language'

Vue.use(Vuex)


export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    user,
    node,
    themes,
    language,
  },
  getters,
})
