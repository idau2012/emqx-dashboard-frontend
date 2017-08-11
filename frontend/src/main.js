import Vue from 'vue'
import { sync } from 'vuex-router-sync'

import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

import App from './App'
import router from './router'
import store from './store'
import * as filters from './filters'


locale.use(lang)

Vue.config.productionTip = false


// register global utility filters.
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

// sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})
