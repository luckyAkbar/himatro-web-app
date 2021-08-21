const { testQuery } = require('../../db/connection')

const {
  npmValidator,
  refIdValidator
} = require('../util/validator')

const getBuktiAbsensiSdmHandler = async (req, res) => {
  const { presensiId, npm } = req.query

  if (!(presensiId && npm && npmValidator(npm) && refIdValidator(presensiId))) {
    res.status(400).render('errorPage', {
      errorMessage: 'Bad Request. PresensiId or NPM is invalid'
    })
    return
  }

  const query = `SELECT nama, gambar_id, resume FROM kehadiran_sdm
    WHERE presensi = $1 AND npm = $2`
  const params = [
    presensiId,
    npm
  ]

  try {
    const { rowCount, rows } = await testQuery(query, params)

    if (rowCount === 0) {
      res.status(404).render('errorPage', {
        errorMessage: 'File not found. Please Please contact admin if you think this is a mistake.'
      })
      return
    }

    const [{ gambar_id, resume, nama }] = rows

    res.status(200).render('viewSdmAbsentMedia', {
      imageSrc: `/images/view/${gambar_id}`,
      resume: resume,
      nama: nama
    })

  } catch (e) {
    console.log(e)
    res.status(500).render('errorPage', {
      errorMessage: 'Server failure. Please contact admin to resolve'
    })
  }
}

module.exports = { getBuktiAbsensiSdmHandler }
