const { referensiIdGenerator } = require('../util/referensiIdGenerator')
const { createNewAbsent } = require('../util/createNewAbsent')
const { postAbsentDataValidator, validateAbsentRefData } = require('../util/validator');
const { absentFiller } = require('../util/absentFiller')
const { testQuery } = require('../../db/connection')

const postAbsentHandler = async (req, res) => {
  if (req.query.mode === 'create') {
    try {
      const validate = await absentRefValidator(req)

      if (!validate) {
        res.status(400).json({error: "Data Kegiatan / Rapat Invalid"})
        return
      }
      console.log('harusnya ini dulu');
    } catch (e) {
      console.log('cannot validate absent ref data', e)
    }

    try {
      console.log('apalagi ini');
      await createNewAbsentRecord(req, res)
      console.log('bukan ini');
    } catch (e) {
      console.log('cannot create new absent record', e)
    }
  }

  if (req.query.mode === 'post') {
    if (!absentDataValidator(req)) {
      res.status(400).json({ error: "Data Absent Invalid" })
      return
    }

    try {
      await absentFiller(req, res)
    } catch(e) {
      console.log(e);
    }
  }
}

const absentDataValidator = (req) => {
  const { refId, npm, nama, keterangan } = req.body

  return postAbsentDataValidator(refId, npm, nama, keterangan)
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

/*
let query = `SELECT * FROM kegiatan WHERE nama_kegiatan = '${namaKegiatan}' AND tanggal_pelaksanaan = '${tanggalPelaksanaan}'::date`

const { rowCount } = await testQuery(query)

if (rowCount === 0) {

}
*/
