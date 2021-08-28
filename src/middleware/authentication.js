
// authentication algorithm
/*
    1. Check if the user sending jwt or not
    2. if user sending jwt
        1. check if jwt valid
        2. if jwt invalid -> go to login
        3. if jwt valid -> is it expired?
        4. if jwt expired -> go to login page
        5. if not, compare user agent stored in db
        6. if not match -> go to login page
        7. if only all match, call next() 
    3. if user is not sending jwt -> go to login
*/

const { verifyJWTToken } = require('../util/jwtToken')
const { getSecondsAfterEpoch } = require('../util/getTimeStamp')
const { testQuery } = require('../../db/connection')

const authentication = async (req, res) => {
    const { jwt } = req.cookies

    try {
        await clearExpiredSession()
    } catch(e) {
        console.log('error clearing expired session', e)
    }

    if (jwt) {
        const query = 'SELECT * FROM sessions WHERE sessionid = $1'
        try {
            
            const { sessionId, session, exp } = verifyJWTToken(jwt)
            
            if (getSecondsAfterEpoch() > exp) {
                console.log('token expired')
                res.status(403).redirect('/login')
                return
            }

            const params = [sessionId]

            const { rowCount, rows } = await testQuery(query, params)

            if (rowCount === 0) {
                res.status(403).render('errorPage', {
                    errorMessage: 'Invalid session issued.'
                })
                return
            }

            if (session !== rows[0].session && req.headers['user-agent'] !== rows[0].useragent) {
                res.status(403).render('errorPage', {
                    errorMessage: 'Unauthorized token usage. Please login first.'
                })
                return
            }

            res.render('adminPage')        
            return

        } catch(e) {
            console.log(e)
            res.sendStatus(403)
            return
        }
    }

    res.status(403).redirect('/login')
    return
}

const clearExpiredSession = async () => {
    const query = 'DELETE FROM sessions where $1 > expired'
    const params = [getSecondsAfterEpoch()]

    try {
        await testQuery(query, params)
    } catch(e) {
        console.log(e)
    }

    return
}

module.exports = { authentication }