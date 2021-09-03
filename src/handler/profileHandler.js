const { testQuery } = require("../../db/connection")
const { verifyJWTToken } = require('../util/jwtToken')

const {
    commonTextValidator,
    commonNumberValidator,
    npmValidator,
} = require('../util/validator')

const getProfile = async (req, res) => {
    const query = 'SELECT * FROM anggota_biasa WHERE email = $1'
    const params = [req.email]

    try {
        const { rows } = await testQuery(query, params)
        res.status(200).json({ rows })
    } catch(e) {
        console.log(e)
    }
}

const updateProfile = async (req, res) => {
    const isPayloadValid = payloadValidator(res, req.body)

    if (!isPayloadValid) {
        return
    }

    try {
        const isUpdaterValid = await checkIsUpdaterValid(req.cookies, req.body)

        if (!isUpdaterValid) {
            console.log('[WARNING]!! Illegal profile updating detected !![WARNING]')
            res.status(403).render('errorPage', {
                errorMessage: 'FORBIDDEN.'
            })
            return
        }

        const isPhoneNumberUnique = await checkIsPhoneWhatsappNumberAvailable(req.body)

        if (!isPhoneNumberUnique) {
            res.status(400).render('errorPage', {
                errorMessage: 'Your phone / whatsapp number is either already taken or invalid.'
            })
            return
        }

        await updateDataAnggotaBiasa(req.body)
        res.status(200).render('commonSuccess', {
            errorMessage: 'Your profile has been saved.'
        })
    } catch(e) {
        console.log('Failed to update data anggota biasa', e)

        res.status(500).render('errorMessage', {
            errorMessage: 'Failed to update your data. Please contact admin to resolve.'
        })
    }
}

const checkIsPhoneNumberUnique = async (noTelpon, noWhatsapp) => {
    const query = 'SELECT COUNT(1) FROM anggota_biasa WHERE no_telpon = $1 OR no_whatsapp = $2'
    const params = [
        noTelpon,
        noWhatsapp
    ]

    if (noTelpon.length > 25 || noWhatsapp.length > 25) {
        return false
    }

    try {
        const { rows } = await testQuery(query, params)

        if (rows[0].count !== '0' && rows[0].npm !== npm) {
            return false
        }

        return true
    } catch(e) {
        console.log(e)
        return false
    }
}

const checkIsPhoneWhatsappNumberAvailable = async (data) => {
    const {
        npm,
        noTelpon,
        noWhatsapp
    } = data

    const query = 'SELECT no_telpon, no_whatsapp FROM anggota_biasa WHERE npm = $1'
    const params = [npm]

    try {
        const { rows } = await testQuery(query, params)

        if (rows[0].no_telpon !== noTelpon || rows[0].no_whatsapp !== noWhatsapp) {
            const isPhoneWhatsappNumberUnique = await checkIsPhoneNumberUnique(noTelpon, noWhatsapp)
            return isPhoneWhatsappNumberUnique
        }

        return true
    } catch(e) {
        console.log(e)
        return false
    }

}

const checkIsUpdaterValid = async ({ jwt }, { npm }) => {
    const { email } = verifyJWTToken(jwt)

    const query = 'SELECT npm FROM anggota_biasa WHERE email = $1'
    const params = [email]

    try {
        const { rows } = await testQuery(query, params)

        if (npm !== rows[0].npm) {
            return false
        }

        return true
    } catch(e) {
        console.log(e)
        return false
    }
}

const payloadValidator = (res, data) => {
    const {
        noTelpon,
        noWhatsapp,
        mediaSosial,
        angkatan,
        programStudi,
        ipk,
        alamat,
        pekerjaan,
        infoLainnya,
        npm
    } = data

    try {
        if (Object.keys(data).length > 10) {
            res.status(413).render('errorPage', {
                errorMessage: 'Payload too large.'
            })
            return false
        }

        if (
            !(
            commonNumberValidator(noTelpon) &&
            commonNumberValidator(noWhatsapp) &&
            commonNumberValidator(angkatan) &&
            commonNumberValidator(ipk) &&
            commonTextValidator(mediaSosial) &&
            commonTextValidator(programStudi) &&
            commonTextValidator(alamat) &&
            commonTextValidator(pekerjaan) &&
            commonTextValidator(infoLainnya) &&
            npmValidator(npm)
            )) {
                res.status(400).render('errorPage', {
                    errorMessage: 'Data invalidddd. Make sure you fill all the required field while also follow every constraint stated.'
                })
                console.log('hei')
                return false
            }
        
        return true

    } catch(e) {
        console.log(e)
        return false
    }
}

const updateDataAnggotaBiasa = async (data) => {
    const {
        noTelpon,
        noWhatsapp,
        mediaSosial,
        angkatan,
        programStudi,
        ipk,
        alamat,
        pekerjaan,
        infoLainnya,
        npm
    } = data

    const query = `UPDATE anggota_biasa SET
        no_telpon = $1,
        no_whatsapp = $2,
        media_sosial = $3,
        angkatan = $4,
        program_studi = $5,
        ipk = $6,
        alamat = $7,
        pekerjaan = $8,
        info_lainnya = $9 WHERE npm = $10`
    
    const params = [
        noTelpon,
        noWhatsapp,
        mediaSosial,
        angkatan,
        programStudi,
        parseFloat(ipk),
        alamat,
        pekerjaan,
        infoLainnya,
        npm
    ]

    try {
        await testQuery(query, params)
    } catch(e) {
        throw new Error('Failed to update data anggota biasa.')
    }
}

module.exports = {
    getProfile,
    updateProfile
}