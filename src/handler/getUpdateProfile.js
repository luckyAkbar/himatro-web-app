const { testQuery } = require("../../db/connection")
const { generateErrorEmail } = require("../util/email")

const getUpdateProfile = async (req, res) => {
    try {
        const isProfileComplete = await checkIsProfileAlreadyComplete(req.email)

        if (isProfileComplete) {
            res.redirect('/profile')
            return
        } else {
            await renderUpdateProfilePage(res, req.email)
        }
    } catch (e) {
        res.redirect('/profile')
    }
}

const checkIsProfileAlreadyComplete = async (email) => {
    const query = 'SELECT data_lengkap FROM anggota_biasa WHERE email = $1'
    const params = [email]

    try {
        const { rows } = await testQuery(query, params)
        return rows[0].data_lengkap
    } catch (e) {
        console.log(e)
        return false
    }
}

const renderUpdateProfilePage = async (res, email) => {
    const query = 'SELECT nama, npm FROM anggota_biasa WHERE email = $1'
    const params = [email]
    
    try {
        const { rows } = await testQuery(query, params)

        res.render('updateProfile', {
            npm: rows[0].npm,
            nama: rows[0].nama
        })

        return
    } catch (e) {
        console.log(e)
        await generateErrorEmail(e)
    }
}

module.exports = { getUpdateProfile }