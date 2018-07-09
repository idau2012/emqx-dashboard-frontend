import Axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'

import router from '../router'
import store from '../store'

NProgress.configure({ showSpinner: false })

Object.assign(Axios.defaults, {
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
  baseURL: '/api/v2',
})

// 请求拦截器添加 headers
Axios.interceptors.request.use((config) => {
  if (store.state.user.username) {
    config.auth = {
      username: store.state.user.username,
      password: store.state.user.password,
    }
  } else {
    router.push({ path: '/login', query: { to: router.fullPath } })
  }
  NProgress.start()
  store.dispatch('LOADING', true)
  return config
}, (error) => {
  console.warn('Request Error: ', error)
})

// handleError
function handleError(error) {
  NProgress.done()
  store.dispatch('LOADING', false)
  const status = error.response && error.response.status
  if (error.response && error.response.data.message) {
    error.message = error.response.data.message
  }
  if (status === 401) {
    store.dispatch('USER_LOGIN', { isLogOut: true })
    router.push({ path: '/login', query: { to: router.fullPath } })
  } else if (status === 404) {
    error.message = '操作失败，URL 不存在'
  }
  if (status !== 401) {
    Message.error(error.message)
  }
  return Promise.reject(error.message)
}

// Response interceptors
Axios.interceptors.response.use((response) => {
  NProgress.done()
  store.dispatch('LOADING', false)
  return response
}, handleError)

export default Axios
