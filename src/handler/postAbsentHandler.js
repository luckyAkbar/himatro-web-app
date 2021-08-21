require('dotenv').config()

const { referensiIdGenerator } = require('../util/generator')
const { absentFiller } = require('../util/absentFiller')
const { testQuery } = require('../../db/connection')
const { isExpired } = require('../util/getTimeStamp')

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
      console.log('cannot validate absent ref data', e)
    }

    const { ref } = req.query
    const refId = referensiIdGenerator(ref)

    try {
      await createNewAbsentRecord(refId, req, res)
    } catch (e) {
      //res.sendStatus(500)
      console.log('cannot create new absent / kegiatan record', e)
    }
  }

  if (req.body.mode === 'post') {
    const { absentId, npm, nama, keterangan, mode } = req.body

    if (!modeValidator(mode)) {
      console.log(modeValidator(mode));
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
      await absentFiller(absentId, npm, nama, keterangan, res)
    } catch(e) {
      console.log(e);
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
