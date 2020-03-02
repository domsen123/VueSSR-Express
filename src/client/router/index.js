import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const createRouter = async () => {
  const router = new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: 'home',
        component: () => import('@/views/Home.vue')
      }
    ]
  })
  return Promise.resolve(router)
}

export default createRouter
