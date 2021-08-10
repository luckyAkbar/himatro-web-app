require('dotenv').config()
const { app } = require('./src/app')

app.on('exit', () => {
  console.log('app closed unexpectedly0')
  app.close()
})

app.on('error', () => {
  console.log('app closed unexpectedly1')
  app.close()
})

app.on('uncaughtException', () => {
  console.log('app closed unexpectedly2')
  app.close()
})

process.on('EADDRINUSE', () => {
  console.log('Restarting due to address error')
  process.exit(-1)
})

app.listen(process.env.SERVER_PORT, () => {
  console.log('Server estabilised on port', process.env.SERVER_PORT)
})
