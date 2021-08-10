const { testQuery } = require('../../db/connection')
const { readDataCsv } = require('../util/readDataCsv')

const table_name = 'absensi'
const refIdField = 'referensi_id'
const npmField = 'npm'
const namaField = 'nama'

const initNewAbsentRecord = async (res, referensiId) => {
  let result = readDataCsv(__dirname+'/../../db/data/test.csv')

  try {
    for(let i = 0; i < result.length; i++) {
      const query = `INSERT INTO ${table_name} (${refIdField}, ${npmField}, ${namaField}) VALUES ($1, $2, $3)`
      const params = [`${referensiId}`, `${result[i].npm}`, `${result[i].nama}`]

      const finished = await testQuery(query, params)
    }
    res.status(201)
  } catch(e) {
    res.status(500)
    console.log(e)
  }
}

const createNewAbsent = async (res, referensiId) => {
  try {
    await initNewAbsentRecord(res, referensiId)
    //db.query('SELECT * FROM absensi'))
  } catch(e) {
    console.log(e)
  }
}

module.exports = { createNewAbsent }
