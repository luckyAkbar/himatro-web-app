const { load } = require('csv-load-sync')
const chalk = require('chalk')
const { namaFormatter } = require('../util/namaFormatter')
const { sdmUIDGenerator } = require('../util/generator')
const { testQuery } = require('../../db/connection')
const { namaKegiatanValidator } = require('../util/validator')
const { readDataCsv } = require('../util/readDataCsv')
const { createNewKegiatan } = require('../util/createNewAbsent')

const kaderisasiSdmHandler = async (req, res) => {
  const { namaKegiatan, catatan } = req.body

  if (!namaKegiatanValidator(namaKegiatan)) {
    res.sendStatus(400)
    return
  }
  const sdmId = sdmUIDGenerator()
  const presensi = sdmUIDGenerator()

  const query = `INSERT INTO sdm_kaderisasi (
    sdm_id,
    judul_kegiatan,
    catatan,
    presensi
  ) VALUES ($1, $2, $3, $4)`
  const params = [
    sdmId, // sdm_id
    namaKegiatan,
    catatan,
    presensi // presensi
  ]

  try {
    await testQuery(query, params)

    const data = {
      refId: presensi,
      tableName: 'kehadiran_sdm',
      recordName: [
        'presensi',
        'nama',
        'npm'
      ]
    }

    const result = await initNewAbsentRecord('sdm', data)
    await createNewKegiatan(presensi, req.body)

    if (result) {
      res.status(201).json({
        message: 'Kegiatan telah tercatat, dan absensi telah terbentuk.',
        absensiId: presensi
      })
    }
  } catch (e) {
    console.log(chalk.red(e))
    res.status(500).json({ error: 'Server error, please contact admin to resolve' })
  }
}

const initNewAbsentRecord = async (opt, data) => {
  if (opt === 'sdm') {
    const {
      refId,
      tableName,
      recordName
    } = data

    const mabaTE = load(__dirname+'/../../db/data/te21.csv')
    const mabaTI = load(__dirname+'/../../db/data/ti21.csv')

    const dataMabaFull = []

    mabaTE.forEach((item) => {
      dataMabaFull.push({
        nama: item.nama,
        npm: item.npm
      })
    })

    mabaTI.forEach((item) => {
      dataMabaFull.push({
        nama: item.nama,
        npm: item.npm
      })
    })

    try {
      for (let i = 0; i < dataMabaFull.length; i++) {
        const query = `INSERT INTO ${tableName} (
            ${recordName[0]},
            ${recordName[1]},
            ${recordName[2]})
          VALUES ($1, $2, $3)`
          const params = [
            refId,
            namaFormatter(dataMabaFull[i].nama),
            dataMabaFull[i].npm
          ]
        const finished = await testQuery(query, params)
      }

      return true
    } catch (e) {
      console.log(chalk.red(e))
    }
  }
}
module.exports = { kaderisasiSdmHandler }
