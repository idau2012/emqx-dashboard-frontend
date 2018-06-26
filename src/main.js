import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import VueI18n from 'vue-i18n'
import ElementLocale from 'element-ui/lib/locale'
// import { Loading, Message, MessageBox } from 'element-ui'
import ElelentUI from 'element-ui'

import App from './App'
import router from './router'
import store from './store'
import './assets/common.scss'
import lang from './common/lang'
import Mount from './common/installer'
import { initThemes } from './common/themes'
import { getLocalStorage } from './common/storage'
import filter from './common/filter'

Vue.config.productionTip = false
Vue.use(VueI18n)
Vue.use(ElelentUI)
Vue.prototype.$ELEMENT = { size: 'small' }
// Vue.use(Loading)
Vue.use(Mount)

// Vue.prototype.$message = Message
// Vue.prototype.$confirm = MessageBox.confirm
// Vue.prototype.$alert = MessageBox.alert
// Vue.prototype.$prompt = MessageBox.prompt
Object.keys(filter).forEach((name) => {
  Vue.filter(name, filter[name])
})

const i18n = new VueI18n({
  locale: getLocalStorage('language') || window.EMQ_DASHBOARD_CONFIG.lang || 'en',
  messages: lang,
})
ElementLocale.i18n((key, value) => i18n.t(key, value))
initThemes()

sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>',
})
