import createApp  from './main'

(async () => {
  const { app, router } = await createApp({ $isServer: false })
  router.onReady(() => {
    app.$mount('#app')
  })
})()
