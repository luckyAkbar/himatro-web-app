const chalk = require('chalk')

const { testQuery } = require('../../db/connection')
const { getNamaKegiatan } = require('../util/getNamaKegiatan')

const {
  refIdValidator,
  modeValidator
} = require('../util/validator')

const {
  checkRefIdExists,
  checkIsExpired,
  checkIsAlreadyOpen
} = require('../util/absentFiller')

const tableName = 'kehadiran_sdm'
const rowName = 'presensi'

const getAbsentSdm = async (req, res) => {
  let { presensiId, mode } = req.query

  if (!presensiId) {
    res.status(200).render('absensi', {
      judulHalaman: 'Silahkan masukan kode absen kegiatan SDM hari ini',
      action: '/kaderisasi/sdm/absensi',
      fieldName: 'presensiId'
    })
    return
  }

  if (!refIdValidator(presensiId.toLowerCase())) {
    res.status(400).render('errorPage', {
      errorMessage: 'Absent code is not valid.'
    })
    return
  }

  const data = {
    presensiId: presensiId,
    tableName: tableName,
    rowName: rowName
  }

  try {
    const isFormExists = await isAbsentFormExists(res, data)

    if (!isFormExists) {
      return
    }

    if (mode === 'view') {
      await viewAbsentResultPage(res, presensiId)
      return
    }

    const isAlreadyOpen = await checkIsAlreadyOpen(presensiId)

    if (!isAlreadyOpen) {
      res.status(403).render('errorPage', {
        errorMessage: 'Sorry, this form is still locked'
      })
      return
    }

    const isExpired = await checkIsExpired(presensiId)

    if (isExpired) {
      res.status(403).render('errorPage', {
        errorMessage: 'Sorry, absent form already closed.'
      })
      return
    }

    res.status(200).render('inputAbsentSdm', {
      presensiId: presensiId
    })
    return

  } catch (e) {
    console.log(chalk.red(e))
  }
}

const viewAbsentResultPage = async (res, presensiId) => {
  const query = `SELECT npm, nama, gambar_id, resume
    FROM kehadiran_sdm
    WHERE presensi = $1 ORDER BY npm`
  const params = [
    presensiId
  ]

  try {
    const { rows } = await testQuery(query, params)

    res.status(200).render('viewSDMAbsent', {
      dataHasilAbsensi: rows,
      namaKegiatan: await getNamaKegiatan(presensiId),
      presensiId: presensiId
    })
    return

  } catch (e) {
    console.log(chalk.red(e))
    res.status(500).render('errorPage', {
      errorMessage: 'Server error. Please contact admin to resolve.'
    })
    return
  }
}

const isAbsentFormExists = async (res, data) => {
  const {
    presensiId,
    tableName,
    rowName
  } = data

  try {
    const result = await checkRefIdExists(presensiId, tableName, rowName)

    if (!result) {
      res.render('errorPage', {
        errorMessage: 'Absent form doesn\'t exist or already closed!'
      })
      return false
    }

    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

module.exports = {
  getAbsentSdm,
}
