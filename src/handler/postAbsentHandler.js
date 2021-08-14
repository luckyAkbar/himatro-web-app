require('dotenv').config()

const { referensiIdGenerator } = require('../util/referensiIdGenerator')
const { createNewAbsent } = require('../util/createNewAbsent')
const { postAbsentDataValidator, validateAbsentRefData, modeValidator } = require('../util/validator');
const { absentFiller } = require('../util/absentFiller')
const { testQuery } = require('../../db/connection')

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
        res.status(400).json({error: "Data Kegiatan / Rapat Invalid"})
        return
      }
    } catch (e) {
      console.log('cannot validate absent ref data', e)
    }

    try {
      await createNewAbsentRecord(req, res)
    } catch (e) {
      console.log('cannot create new absent record', e)
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
      res.status(400).json({ error: "Data Absent Invalid" })
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

  if (!validateAbsentRefData(namaKegiatan, tanggalPelaksanaan, tanggalBerakhir)) {
    return false
  }

  return true
}

const createNewAbsentRecord = async (req, res) => {
  const { ref } = req.query

  if (ref === 'keg') {
    //look at the bottom
    const referensiId = referensiIdGenerator(ref)

    try {
      await createNewAbsent(res, referensiId)
      res.json({ refId: `${referensiId}` })
    } catch(e) {
      res.status(500).json({ error: "Server Error" })
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
