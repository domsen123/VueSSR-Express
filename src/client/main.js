import Vue from 'vue'
import App from './App'
import createRouter from './router'

const createApp = async (context) => {
  const router = await createRouter()

  const app = new Vue({
    context,
    router,
    render: h => h(App)
  })
  return Promise.resolve({ app, router })
}

export default createApp
