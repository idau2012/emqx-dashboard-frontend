import Vue from 'vue'
import VueRouter from 'vue-router'
import { sync } from 'vuex-router-sync'

import {
  Button, Input, Row, Col, Card,
  Select, Checkbox,
  Form, FormItem,
  Menu, MenuItem, MenuItemGroup,
} from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

import App from './App'
import router from './router'
import store from './store'
import * as filters from './filters'


Vue.use(VueRouter)
Vue.use(Button)
Vue.use(Input)
Vue.use(Col)
Vue.use(Row)
Vue.use(Card)
Vue.use(Select)
Vue.use(Checkbox)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
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
