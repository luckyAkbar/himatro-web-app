const { testQuery } = require('../../db/connection')
const { getTimeStamp } = require('../util/getTimeStamp')
const { QueryError } = require('../classes/QueryError')

const {
    sendEmail,
    generateErrorEmail
} = require('../util/email')

const {
    npmValidator,
    namaValidator,
    prodiValidator,
    departemenValidator,
    divisiValidator,
    jabatanValidator,
    tanggalLahirValidator,
    golonganDarahValidator,
    jalurMasukValidator,
    ipkValidator,
    multipleCommonTextValidator,
    multipleCommonNumberValidator,
} = require('../util/validator')

const updateProfile = async (req, res) => {
    const payload = req.body
    const isPayloadValid = payloadValidator(res, payload)

    if (!isPayloadValid) {
        return
    }

    try {
        const isUpdaterValid = await checkIsUpdaterValid(req.email, req.body)

        if (!isUpdaterValid) {
            console.log('[WARNING]!! Illegal profile updating detected !![WARNING]')
            res.status(403).json({ errorMessage: 'Illegal profile updating detected. This incident will be reported automatically by sistem.' })
            generateReportEmail(req)
            return
        }

        const isPhoneNumberUnique = await checkIsPhoneNumberAndInstagramUnique(req.body)

        if (!isPhoneNumberUnique) {
            res.status(400).json({ errorMessage: 'Your phone / whatsapp / telegram number or instagram is either already taken or invalid. Please try again using another one.' })
            return
        }

        await updateDataAnggotaBiasa(req.body)
        res.status(200).json({ message: 'Your profile has been saved.' })
    } catch(e) {
        console.log('Failed to update data anggota biasa', e)

        res.status(500).render('errorMessage', {
            errorMessage: 'Failed to update your data. Please contact admin to resolve.'
        })
    }
}

const checkIsPhoneNumberAndInstagramUnique = async ({ noTelp, noWA, noTele, ig}) => {
    if (noWA.length > 25 || noTelp.length > 25 || noTele.length > 25) {
        return false
    }

    const query = `SELECT COUNT(1) FROM anggota_biasa WHERE
        no_telpon = $1 OR no_whatsapp = $2 OR no_telegram = $3 OR instagram = $4`

    const params = [
        noTelp,
        noWA,
        noTele,
        ig
    ]

    try {
        const { rows } = await testQuery(query, params)

        if (rows[0].count !== '0') {
            return false
        }

        return true
    } catch(e) {
        console.log(e)
        return false
    }
}

const checkIsUpdaterValid = async (email, { npm }) => {
    const query = 'SELECT npm, data_lengkap FROM anggota_biasa WHERE email = $1'
    const params = [email]

    try {
        const { rows } = await testQuery(query, params)

        if (npm !== rows[0].npm || rows[0].data_lengkap === true) {
            return false
        }

        return true
    } catch(e) {
        console.log(e)
        return false
    }
}

const generateReportEmail = async (req) => {
    const message = {
        from: 'lucky.pengelolawebhimatro@gmail.com',
        to: 'lucky.akbar105619@students.unila.ac.id',
        subject: 'Illegal Update Profile in Himatro Web App',
        html: `
            <h1>Illegal Profile Updating Happened</h1>
            <p>This incedent happen on ${getTimeStamp()}</p>
            <p>Issuer: ${req.email} on this data: </p>
            <p>${JSON.stringify(req.body)}</p>
            <p>Please check it now.</p>
        `
    }

    try {
        await sendEmail(message)
    } catch (e) {
        console.log(`error send report email on ${req.email} in ${req.body}`)
    }
}

const payloadValidator = (res, data) => {
    const {
        nama,
        npm,
        prodi,
        departemen,
        divisi,
        jabatan,
        tempatLahir,
        tanggalLahir,
        golonganDarah,
        alamat,
        noTelp,
        noWA,
        noTele,
        ig,
        jalurMasuk,
        hobi,
        keahlian,
        ipk,
        riwayatPenyakit
    } = data

    const commonTextData = [
        tempatLahir,
        alamat,
        hobi,
        keahlian,
        riwayatPenyakit
    ]

    const commonNumberData = [
        noTelp,
        noWA,
        noTele
    ]

    try {
        if (Object.keys(data).length > 19) {
            res.status(413).json({ errorMessage: `Don't send unnecessary data!` })
            return false
        } else if (Object.keys(data).length < 19) {
            res.status(400).json({ errorMessage: 'Please send all the required data!'})
        }

        console.log(divisiValidator(divisi))

        if (
            !(
                namaValidator(nama) &&
                npmValidator(npm) &&
                prodiValidator(prodi) &&
                departemenValidator(departemen) &&
                divisiValidator(divisi) &&
                jabatanValidator(jabatan) &&
                tanggalLahirValidator(tanggalLahir) &&
                golonganDarahValidator(golonganDarah) &&
                jalurMasukValidator(jalurMasuk) &&
                ipkValidator(ipk) &&
                multipleCommonTextValidator(commonTextData) &&
                multipleCommonNumberValidator(commonNumberData)
            )
        ) {
            res.status(400).json({ errorMessage: 'Invalid. Make sure you fill all the required field while also follow every constraint stated or you can read the instruction for this feature.' })
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
        npm,
        prodi,
        tempatLahir,
        tanggalLahir,
        golonganDarah,
        alamat,
        noTelp,
        noWA,
        noTele,
        ig,
        jalurMasuk,
        hobi,
        keahlian,
        ipk,
        riwayatPenyakit
    } = data

    const query = `UPDATE anggota_biasa SET
        program_studi = $1,
        tempat_lahir = $2,
        tanggal_lahir = $3,
        golongan_darah = $4,
        alamat = $5,
        no_telpon = $6,
        no_whatsapp = $7,
        no_telegram = $8,
        instagram = $9,
        jalur_masuk = $10,
        hobi = $11,
        keahlian = $12,
        ipk = $13,
        riwayat_penyakit = $14,
        data_lengkap = true WHERE npm = $15`
    
    const params = [
        prodi,
        tempatLahir,
        tanggalLahir,
        golonganDarah,
        alamat,
        noTelp,
        noWA,
        noTele,
        ig,
        jalurMasuk,
        hobi,
        keahlian,
        parseFloat(ipk),
        riwayatPenyakit,
        npm
    ]

    try {
        await testQuery(query, params)
    } catch(e) {
        generateErrorEmail(e, params)
        throw new Error('Failed to update data anggota biasa.')
    }
}

module.exports = { updateProfile }