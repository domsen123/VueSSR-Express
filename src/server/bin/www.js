import http from 'http'
import createServer from '../server'

(async() => {
  const app = await createServer()
  const server = http.createServer(app)
  server.listen(8000, console.log('server is listening on 8000'))
})()
