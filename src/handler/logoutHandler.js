const { verifyJWTToken } = require('../util/jwtToken')
const { testQuery } = require('../../db/connection')

const logoutHandler = async (req, res) => {
    const { jwt } = req.cookies

    res.cookie('jwt', '-', {
        maxAyge: 1,
        httpOnly: true
    }).render('commonSuccess', {
        successMessage: 'Logout Success'
    })

    try {
        await deleteSession(jwt)
    } catch(e) {
        console.log(e)
    }

    return
}

const deleteSession = async (jwt) => {
    try { // gak masuk akal. Kok 2x ya nge-get logoutnya?
        const {
            session,
            sessionId
        } = verifyJWTToken(jwt)

        const query = 'DELETE FROM sessions WHERE sessionId = $1 AND session = $2'
        const params = [
            sessionId,
            session
        ]

        await testQuery(query, params)
    } catch(e) {
        return
    }
}

module.exports = { logoutHandler }