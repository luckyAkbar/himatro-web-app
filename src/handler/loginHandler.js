require('dotenv').config()

const { emailValidator } = require('../util/validator')
const { compareHash } = require('../util/cryptoHash')
const { testQuery } = require('../../db/connection')
const { createJWTToken } = require('../util/jwtToken')
const { sessionGenerator, sessionIdGenerator } = require('../util/generator')
const { getSecondsAfterEpoch } = require('../util/getTimeStamp')

const postLoginHandler = async (req, res) => {
  const { email, password } = req.body

  if (!(email && password)) {
    res.status(400).render('errorPage', {
      errorMessage: 'Email and Password fields are required.'
    })
    return
  }

  if (!emailValidator(email)) {
    res.status(400).render('errorPage', {
      errorMessage: 'Email invalid.'
    })
    return
  }

  let query = `SELECT password from users where email = $1`
  let params = [email]

  try {
    const { rowCount, rows } = await testQuery(query, params)

    if (rowCount === 0) {
      res.status(404).render('errorPage', {
        errorMessage: 'User not found.'
      })
      return
    }

    const isPasswordMatch = await compareHash(password, rows[0].password)

    if (!isPasswordMatch) {
      res.status(403).render('errorPage', {
        errorMessage: 'Failed, credentials does not match.'
      })
      return
    }

    const session = sessionGenerator()
    const sessionId = sessionIdGenerator()
    const expired = getSecondsAfterEpoch() + Number(process.env.JWT_TOKEN_EXPIRES_SEC)

    const jwt = createJWTToken(session, sessionId, email)
    
    res.cookie('jwt', jwt, {
      maxAge: process.env.JWT_TOKEN_EXPIRES_MILIS,
      httpOnly: true
    })
    
    res.status(200).redirect('/')

    query = 'INSERT INTO sessions (sessionid, session, useragent, expired, email) VALUES($1, $2, $3, $4, $5)'
    params = [
      sessionId,
      session,
      req.headers['user-agent'],
      expired,
      email
    ]

    await testQuery(query, params)
    return
  } catch(e) {
    console.log(e)
    return
  }
  res.sendStatus(200)
  return
}

const getLoginPage = (req, res) => {
  res.status(200).render('login')
  return
}

module.exports = { postLoginHandler, getLoginPage }