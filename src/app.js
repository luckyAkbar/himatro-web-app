const express = require('express')
const ejs = require('ejs')
const { router } = require('./routes/router')

const app = express()
app.set('view engine', 'ejs')
app.use(express.static('./public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.json({ type: 'application/json' }))
app.use('/', router)

module.exports = { app }
