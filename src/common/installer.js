import API from './api'

import EmqSelect from '../components/EmqSelect'
import JsonEditor from '../components/JsonEditor'


export default (Vue) => {
  Vue.prototype.$httpGet = (url, params = {}) => {
    // fix IE cache application/json response
    params._ = Date.now()
    return API.get(url, { params })
  }
  Vue.prototype.$httpPost = API.post
  Vue.prototype.$httpPut = API.put
  Vue.prototype.$httpDelete = API.delete
  Vue.prototype.$axios = API
  Vue.prototype.$env = window.EMQ_DASHBOARD_CONFIG || {}

  Vue.component(EmqSelect.name, EmqSelect)
  Vue.component(JsonEditor.name, JsonEditor)
}
