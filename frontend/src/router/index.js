import Vue from 'vue'
import Router from 'vue-router'

import store from '@/store'


Vue.use(Router)


const routes = [
  {
    path: '/login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/signup',
    component: () => import('@/views/Signup.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('@/views/Home.vue'),
    children: [
      {
        path: '',
        alias: 'overview',
        component: () => import('@/views/Overview.vue'),
      },
      {
        path: '/cluster',
        component: () => import('@/views/Cluster.vue'),
      },
      {
        path: '/cluster/:node/graph/:graph_type',
        component: () => import('@/views/Graph.vue'),
      },
      {
        path: '/cluster/:node/emqdatas',
        component: () => import('@/views/Datas.vue'),
      },
      {
        path: '/alerts',
        component: () => import('@/views/Alerts.vue'),
      },
      {
        path: '/nodes',
        component: () => import('@/views/Nodes.vue'),
      },
      {
        path: '/nodes/:node/plugins',
        component: () => import('@/views/Plugins.vue'),
      },
      // {
      //   path: 'emq/websocket',
      //   component: () => import('@/views/Websocket.vue'),
      // },
      {
        path: 'setting/users',
        component: () => import('@/views/Users.vue'),
      },
    ],
  },
  {
    path: '*',
    meta: { requiresAuth: false },
    component: () => import('@/views/404.vue'),
  },
]

// Routing logic
const router = new Router({
  mode: 'history',
  routes,
})

// check if logged in, if not, redirect to login page.
router.beforeEach((to, from, next) => {
  const { requiresAuth = true } = to.meta
  if (requiresAuth) {
    // if (!store.state.user.token) {
    if (!store.state.user.password) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
