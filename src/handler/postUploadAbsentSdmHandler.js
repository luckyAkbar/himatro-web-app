const chalk = require('chalk')

const { testQuery } = require('../../db/connection')

const {
  checkIsExpired,
  checkIsAlreadyOpen
} = require('../util/absentFiller')

const {
  upload,
  multerErrorChecker
} = require('../util/multerImageUpload')

const {
  AbsentFillerNotRegisteredError
} = require('../classes/AbsentFillerNotRegisteredError')

const {
  namaValidator,
  npmValidator,
  refIdValidator
} = require('../util/validator')

const uploadAbsentSdmHandler = async (req, res) => {
  try {
    await upload(req, res, async (err) => {
      const { nama, npm, resume, presensiId } = req.body

      if (multerErrorChecker(res, err)) {
        return
      }

      if (!validateAbsentData(res, nama, npm, presensiId)) {
        return
      }

      const isAlreadyOpen = await checkIsAlreadyOpen(presensiId)

      if (!isAlreadyOpen) {
        res.status(400).render('errorPage', {
          errorMessage: 'Sorry, this form is still locked'
        })
        return
      }

      const isExpired = await checkIsExpired(presensiId)

      if (isExpired) {
        res.status(403).render('errorPage', {
          errorMessage: 'Sorry, absent form already closed'
        })
        return
      }

      const isAlreadyFilledQueryData = {
        refId: presensiId,
        npm: npm,
        targetRow: 'gambar_id',
        tableName: 'kehadiran_sdm',
        rowName: [
          'presensi',
          'npm'
        ]
      }

      const alreadyAbsent = await isAlreadyAbsent(res, 'sdm', isAlreadyFilledQueryData)

      if (alreadyAbsent) {
        return
      }

      let query = `UPDATE kehadiran_sdm
        SET gambar_id = $1, resume = $2
        WHERE presensi = $3 AND npm = $4`

      let params = [
        req.file.id,
        resume,
        presensiId,
        npm
      ]

      await testQuery(query, params)

      query = `INSERT INTO gambar (
        gambar_id,
        nama_gambar
      ) VALUES (
        $1,
        $2
      );`

      params = [
        req.file.id,
        req.file.realname
      ]

      await testQuery(query, params)
      res.status(200).render('successAbsent', {
        nama: nama,
        link: `?presensiId=${presensiId}&mode=view`
      })
    })

  } catch (e) {
    console.log(chalk.red(e))
    res.status(500).render('errorPage', {
      errorMessage: 'Server failure. Please contact admin to resolve.'
    })
    return
  }
}

const validateAbsentData = (res, nama, npm, presensiId) => {
  if (!(namaValidator(nama) && npmValidator(npm) && refIdValidator(presensiId))) {
    res.status(400).render('errorPage', {
      errorMessage: 'Absent data invalid or image type not allowed (must .PNG / .JPEG) 1MB max.'
    })
    return false
  }

  return true
}

const isAlreadyAbsent = async (res, opt, queryData) => {
  const {
    refId,
    npm,
    targetRow,
    tableName,
    rowName // refId, npm
  } = queryData

  const query = `SELECT ${targetRow} FROM ${tableName}
    WHERE ${rowName[0]} = $1 AND ${rowName[1]} = $2`
  const params = [
    refId,
    npm
  ]

  const { rowCount, rows } = await testQuery(query, params)

  if (rowCount === 0) {
    res.status(403).render('errorPage', {
      errorMessage: 'NPM is not registered. Please contact admin to resolve if you think this is a mistake'
    })
    return true
  }

  if (opt === 'sdm') {
    if (rows[0].gambar_id) {
      res.status(403).render('errorPage', {
        errorMessage: 'Can\'t change attendance record'
      })
      return true
    }
  }

  return false
}

module.exports = { uploadAbsentSdmHandler }
