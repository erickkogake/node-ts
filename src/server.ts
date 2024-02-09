import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { env } from './env'
import { transactionRoute } from './routes/transactions'

const app = fastify()

app.register(cookie)
app.register(transactionRoute, {
  prefix: 'transactions'
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('🚀 HTTP Server Running')
  })
