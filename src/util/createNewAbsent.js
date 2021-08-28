const chalk = require('chalk')

const { testQuery } = require('../../db/connection')
const { readDataCsv } = require('./readDataCsv')

const table_name = 'absensi'
const refIdField = 'referensi_id'
const divField = 'divisi'
const npmField = 'npm'
const namaField = 'nama'

const initNewAbsentRecord = async (res, referensiId) => {
  let result = readDataCsv(__dirname+'/../../db/data/fullData.csv')

  try {
    for(let i = 0; i < result.length; i++) {
      const query = `INSERT INTO ${table_name} (${refIdField}, ${npmField}, ${namaField}, ${divField}) VALUES ($1, $2, $3, $4)`
      const params = [`${referensiId}`, `${result[i].npm}`, `${result[i].nama}`, `${result[i].divisi}`]

      const finished = await testQuery(query, params)
    }
    res.status(201)
  } catch(e) {
    res.status(500)
    console.log(chalk.red(e))
  }
}

const createNewAbsent = async (res, referensiId) => {
  try {
    await initNewAbsentRecord(res, referensiId)
    //db.query('SELECT * FROM absensi'))
  } catch(e) {
    console.log(chalk.red(e))
  }
}

const createNewKegiatan = async (refId, {
  namaKegiatan,
  tanggalPelaksanaan,
  tanggalBerakhir
}) => {
  const query = `INSERT INTO kegiatan (
    kegiatan_id,
    nama_kegiatan,
    tanggal_pelaksanaan,
    tanggal_berakhir
  ) VALUES ($1, $2, $3, $4)`

  const params = [
    refId,
    namaKegiatan,
    tanggalPelaksanaan,
    tanggalBerakhir
  ]

  try {
    await testQuery(query, params)
    return
  } catch (e) {
    console.log(chalk.red(e))
    throw new Error('Failed to create new kegiatan')
  }
}

module.exports = {
  createNewAbsent,
  createNewKegiatan
}
