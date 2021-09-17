const { testQuery } = require('../../db/connection')
const { QueryError } = require('../classes/QueryError')
const { readDataCsv } = require('./readDataCsv')

const initNewAbsentRecord = async (referensiId) => {
  let dataPengurusHimatro = readDataCsv(__dirname+'/../../db/data/fullData.csv')

  try {
    for(let i = 0; i < dataPengurusHimatro.length; i++) {
      const query = 'INSERT INTO absensi (referensi_id, npm, nama, divisi) VALUES ($1, $2, $3, $4)'
      const params = [
        referensiId,
        dataPengurusHimatro[i].npm,
        dataPengurusHimatro[i].nama,
        dataPengurusHimatro[i].divisi
      ]

      await testQuery(query, params)
    }
  } catch(e) {
    console.log(e)
    throw new QueryError('failed to create new Absent')
  }
}

const createNewAbsent = async (referensiId) => {
  try {
    await initNewAbsentRecord(referensiId)
  } catch(e) {
    console.log(e)
    throw new QueryError('failed to create new absent')
  }
}

const createNewKegiatan = async (refId, {
  namaKegiatan,
  mulai,
  akhir
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
    mulai,
    akhir
  ]

  try {
    await testQuery(query, params)
    return
  } catch (e) {
    console.log(e)
    throw new QueryError('Failed to create new kegiatan')
  }
}

module.exports = {
  createNewAbsent,
  createNewKegiatan
}
