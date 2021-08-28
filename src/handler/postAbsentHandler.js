require('dotenv').config()
const chalk = require('chalk')

const { referensiIdGenerator } = require('../util/generator')
const { testQuery } = require('../../db/connection')
const { isExpired } = require('../util/getTimeStamp')

const {
  absentFiller,
  checkIsAlreadyOpen,
  checkIsExpired
} = require('../util/absentFiller')

const {
  createNewAbsent,
  createNewKegiatan
} = require('../util/createNewAbsent')

const {
  postAbsentDataValidator,
  validateAbsentRefData,
  modeValidator
} = require('../util/validator');

const postAbsentHandler = async (req, res) => {

  if (req.query.mode === 'create') {
    try {
      const { password } = req.body

      if (password !== process.env.PASSWORD) {
        res.sendStatus(403)
        return
      }

      const validate = await absentRefValidator(req)

      if (!validate) {
        res.status(400).render('errorPage', {
          errorMessage: 'Data Kegiatan / Rapat Invalid'
        })
        return
      }
    } catch (e) {
      res.sendStatus(500)
      console.log(chalk.red('Can\'t validate absent data',e))
    }

    const { ref } = req.query
    const refId = referensiIdGenerator(ref)

    try {
      await createNewAbsentRecord(refId, req, res)
    } catch (e) {
      //res.sendStatus(500)
      console.log(chalk.red('cannot create new absent / kegiatan record', e))
    }
  }

  if (req.body.mode === 'post') {
    const { absentId, npm, nama, keterangan, mode } = req.body

    if (!modeValidator(mode)) {
      res.sendStatus(404)
      return
    }

    if (!absentDataValidator(absentId, npm, nama, keterangan)) {
      res.status(400).render('errorPage', {
        errorMessage: 'Data Absen Invalid'
      })
      return
    }

    try {
      const isAlreadyOpen = await checkIsAlreadyOpen(absentId)

      if (!isAlreadyOpen) {
        res.status(403).render('errorPage', {
          errorMessage: 'Sorry, this form is still locked'
        })
        return
      }

      const isExpired = await checkIsExpired(absentId)

      if (isExpired) {
        res.status(403).render('errorPage', {
          errorMessage: 'Sorry, absent form already closed.'
        })
        return
      }

      await absentFiller(absentId, npm, nama, keterangan, res)
    } catch(e) {
      console.log(chalk.red(e));
    }
  }
}

const absentDataValidator = (absentId, npm, nama, keterangan) => {
  return postAbsentDataValidator(absentId, npm, nama, keterangan)
}

const absentRefValidator = async (req) => {
  const { namaKegiatan, tanggalPelaksanaan, tanggalBerakhir } = req.body

  if (!/:/g.test(tanggalBerakhir)) {
    tanggalBerakhir += ' 23:59:00'
  }

  if (!validateAbsentRefData(namaKegiatan, tanggalPelaksanaan, tanggalBerakhir)) {
    return false
  }

  return true
}

const createNewAbsentRecord = async (refId, req, res) => {
  const { ref } = req.query

  if (ref === 'keg') {
    //look at the bottom
    try {
      await createNewAbsent(res, refId)
      await createNewKegiatan(refId, req.body)
      res.json({ refId: `${refId}` })
    } catch(e) {
      res.status(500).json({ error: "Server Error" })
      return
    }
    return
  }

  if (ref === 'rap') {
    res.status(501).json({ error: "Not Implemented" })
    return
  }

  if (ref === undefined) {
    res.status(400).json({ error: "Malformed Request" })
    return
  }

  res.status(400).json({ error: "Malformed Request "})
  return
}

module.exports = { postAbsentHandler }
