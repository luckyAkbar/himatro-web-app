const express = require('express')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const ejs = require('ejs')
const { router } = require('./routes/router')
const { incomingRequestLogger } = require('./middleware/incomingRequestLogger')
const { incorrectJSONFormatErrorHandler } = require('./util/incorrectJSONFormatErrorHandler')

const app = express()
app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(helmet({
    contentSecurityPolicy: false
}))
app.use(express.static('./public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.json({ type: 'application/json' }), incorrectJSONFormatErrorHandler)
app.use('/', incomingRequestLogger)
app.use('/', router)

module.exports = { app }
