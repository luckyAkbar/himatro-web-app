require('dotenv').config()

const { referensiIdGenerator } = require('../util/generator')
const { validateAbsentRefData } = require('../util/validator')

const {
  createNewAbsent,
  createNewKegiatan
} = require('../util/createNewAbsent')

const createNewKegiatanFeature = async (req, res) => {
    try {
      const validate = await absentRefValidator(req)

      if (!validate) {
        res.status(400).render('errorPage', {
          errorMessage: 'Data Kegiatan / Rapat Invalid'
        })
        return
      }
    } catch (e) {
      res.sendStatus(500)
      console.log(e)
    }

    const refId = referensiIdGenerator('keg')

    try {
      await createNewAbsentRecord(refId, req, res)
    } catch (e) {
      res.status(500).render('errorPage', {
        errorMessage: 'Server error. Please contact admin to resolve'
      })
      console.log(e)
    }
}

const absentRefValidator = async (req) => {
  let { namaKegiatan, tanggalPelaksanaan, tanggalBerakhir } = req.body

  if (!/:/g.test(tanggalBerakhir)) {
    req.body.tanggalBerakhir += ' 23:59:00'
  }

  if (!validateAbsentRefData(namaKegiatan, tanggalPelaksanaan, tanggalBerakhir)) {
    return false
  }

  return true
}

const createNewAbsentRecord = async (refId, req, res) => {
  try {
    await createNewAbsent(res, refId)
    await createNewKegiatan(refId, req.body)
    
    res.status(201).render('commonSuccess', {
      successMessage: `Absent ID: ${refId}`
    })
  } catch(e) {
    res.status(500).json({ error: "Server Error" })
    return
  }
}

module.exports = { createNewKegiatanFeature }
