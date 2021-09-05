require('dotenv').config()
const express = require('express')
const app = express()

/*
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

app.on('EADDRINUSE', () => {
  console.log('Restarting due to address error')
  process.exit(-1)
})
*/

const port = process.env.port || 3000

app.get('/', (req, res) => {
  res.sendStatus(200)
})

app.listen(port, () => {
  console.log('Server estabilised on port', port)
  //console.log(`On DATABASE: ${process.env.PGDATABASE}`)
})
