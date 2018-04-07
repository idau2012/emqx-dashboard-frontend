import API from './api'

export default (Vue) => {
  Vue.prototype.$httpGet = (url, params) => API.get(url, { params })
  Vue.prototype.$httpPost = API.post
  Vue.prototype.$httpPut = API.put
  Vue.prototype.$httpDelete = API.delete
  Vue.prototype.$axios = API
}
