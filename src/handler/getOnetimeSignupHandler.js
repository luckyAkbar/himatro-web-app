const getOnetimeSignupHandler = (req, res) => {
    res.status(200).render('signup')
    return
}

module.exports = {
    getOnetimeSignupHandler
}