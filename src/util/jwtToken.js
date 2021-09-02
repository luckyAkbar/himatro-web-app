require('dotenv').config()

const jwt = require('jsonwebtoken')
const { sesionIdGenerator } = require('./generator')

const createJWTToken = (session, sessionId) => {
  return jwt.sign({
    session,
    sessionId
  }, process.env.SECRET_JWT_TOKEN, {
    expiresIn: Number(process.env.JWT_TOKEN_EXPIRES_SEC),
  })
}

const verifyJWTToken = (token) => {
  const result = jwt.verify(token, process.env.SECRET_JWT_TOKEN, (err, decoded) => {
    if (err) {
      return new Error('Token is not authentic')
    }

    return decoded
  })

  if (result instanceof Error) {
    throw new Error('Token invalid')
  } else {
    return result
  }

}

module.exports = {
  createJWTToken,
  verifyJWTToken
}

/*
const coba = async () => {
  try {
    const sessionId = sesionIdGenerator() // go to db
    console.log('userId:', sessionId);

    const hashedSessionId = await createHash(sessionId) // go to user as sessionId in jwt
    console.log('hashed', hashedSessionId);

    const token = createJWTToken(hashedSessionId) // send jwt to user
    console.log('jwt:', token);

    const result = verifyJWTToken(token) // got jwt from user
    console.log('result', result);

    const comparedHash = await compareHash(sessionId, result.userId) // comparing sessionId from user's jwt, and then comparing it with actual session id stored in database
    console.log('compared:', comparedHash);
  } catch (e) {
    console.log(e);
  }
}

const hashedUserId = await createHash(userId)
console.log('hashedUserId:', hashedUserId)

const jwtToken = createJWTToken(userId)
console.log('jwt token:', jwtToken);

const result = verifyJWTToken(jwtToken)
console.log('result: ', result);
userId === result.userId ? console.log('true'): console.log('false');

const getUserId = await compareHash(userId, result.userId)
console.log('userId?:', getUserId);


const jwtExp = 1629694412
const sec = getSecondsAfterEpoch()

if ((sec - jwtExp) > process.env.JWT_TOKEN_EXPIRES_SEC) {
  console.log('kadaluarsa')
}

const { verifyJWTToken } = require('../util/jwtToken')
const { compareHash } = require('../util/cryptoHash')
const { testQuery } = require('../../db/connection')
const { getSecondsAfterEpoch } = require('../util/getTimeStamp')

const authentication = (req, res) => {
    const { jwt } = req.cookies

    if (!jwt) {
        res.status(401).redirect('/login')
        return
    }

    try {
        const result = jwtValidation(jwt, req.headers['user-agent'])

        if (!result) {
            res.status(401).redirect('/login')
            return
        }

        res.sendStatus(200)
        //next()
    } catch(e) {
        res.status(401).redirect('/login')
        return
    }

}

const jwtValidation = async (jwt, userAgent) => {
    try {
        const { sessionId, exp, session } = verifyJWTToken(jwt)

        if (getSecondsAfterEpoch() > exp) {
            console.log('false bays');
            return false
        }

        const isSessionValid = await sessionValidation(userAgent, sessionId, session)

        if (!isSessionValid) {
            return false
        }

        return true
    } catch (e) {
        return false
    }
}

const sessionValidation = async (userAgent, sessionId, userSession) => {
    console.log(sessionId);
    const query = `SELECT * FROM sessions WHERE sessionid = $1`
    const params = [sessionId]

    try {
        const { rows } = await testQuery(query, params)
        const [
            session,
            useragent,
        ] = rows

        console.log('_');

        if (userAgent !== useragent) {
            return false
        }

        const isSessionValid = await compareHash(userSession, session)

        if (!isSessionValid) {
            return false
        }

        return true
    } catch(e) {
        return false
    }
}

module.exports = {
    authentication,
    jwtValidation
}

require('dotenv').config()
const chalk = require('chalk')

const { emailValidator } = require('../util/validator')
const { testQuery } = require('../../db/connection')
const { sessionGenerator } = require('../util/generator')
const { getTimeStamp } = require('../util/getTimeStamp')
const { jwtValidation } = require('../middleware/authentication');

const {
  createJWTToken,
  verifyJWTToken
} = require('../util/jwtToken')

const {
  createHash,
  compareHash,
} = require('../util/cryptoHash')

const getLoginPage = (req, res) => {
  res.render('login')
  return
}

const postLoginHandler = async (req, res) => {
  const { email } = req.body
  const { jwt } = req.cookies

  if (jwt) {
    console.log('hei', jwt);
    try {
      const isJWTValid = await jwtValidation(jwt, req.headers['user-agent'])
      console.log('woy', isJWTValid);

      if (isJWTValid) {
        console.log('valid');
        res.status(226).json({ message: 'Already logged in.'})
        return
      }

    } catch(e) {
      console.log(e)
      return
    }
  }

  const isEmailValid = emailValidator(email.toLowerCase())

  if (!isEmailValid) {
    res.status(400).render('errorPage', {
      errorMessage: 'Email and/or Password is invalid'
    })
    return
  }

  try {
    const isPasswordValid = await verifyPassword(req.body)

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Login failed. Credential doesn\'t match' })
      return
    }

    await createNewSession(req, res)
    return
  } catch (e) {
    console.log(chalk.red(e))
    return
  }
}


const verifyPassword = async ({ email, password }) => {
  const query = `SELECT password from users where email = $1`
  const params = [email]

  const { rowCount, rows } = await testQuery(query, params)

  if (rowCount === 0) {
    return
  }

  try {
    const result =  await compareHash(password, rows[0].password)
    return result
  } catch (e) {
    console.log(chalk.red(e))
    throw new Error('failed Verfing password')
  }
}

const createNewSession = async (req, res) => {
  const session = sessionGenerator()
  const sessionId = sessionGenerator()
  const jwtToken = createJWTToken(session, sessionId)

  res.cookie('jwt', jwtToken, {
    maxAge: process.env.JWT_TOKEN_EXPIRES_MILIS,
    httpOnly: true,
  })

  const redirectionTarget = req.originalUrl === '/login' ? '/protected/route' : req.originalUrl
  res.status(200).redirect(redirectionTarget)

  const query = `INSERT INTO sessions (
    sessionid,
    session,
    useragent
  ) VALUES ($1, $2, $3)`

  try {
    const hashedSession = await createHash(session)
    const params = [
      sessionId,
      hashedSession,
      req.headers['user-agent'],
    ]

    await testQuery(query, params)
    return
  } catch (e) {
    console.log(chalk.red(e))
    throw new Error('JWT set, but failed to create new session.')
  }
}

module.exports = {
  getLoginPage,
  postLoginHandler,
}

*/



