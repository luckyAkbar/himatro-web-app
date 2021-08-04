require('dotenv').config()
const { app } = require('./src/app')

app.listen(process.env.SERVER_PORT, () => {
  console.log('Server estabilised on port', process.env.SERVER_PORT)
})

app.on('exit', () => {
  app.close()
})

app.on('uncaughtException', () => {
  console.log('app closed unexpectedly')
  app.close()
})
