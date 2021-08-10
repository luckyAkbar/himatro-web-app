const { testQuery } = require('../../db/connection')
const { AbsentFillerNotRegisteredError } = require('../classes/AbsentFillerNotRegisteredError')

const table_name = 'absensi'
const ref_id_field = 'referensi_id'
const keterangan_field = 'keterangan'
const npm_field = 'npm'
const nama_field = 'nama'
const comparation_operator = '='
const logical_and_operator = 'AND'

const checkAlreadyFilled = async (ref_id, npm, nama) => {
  const query = `SELECT ${keterangan_field} FROM ${table_name} WHERE ${npm_field} = $1 AND ${ref_id_field} = $2`
  const params = [npm, ref_id]

  try {
    const { rows } = await testQuery(query, params)

    if (rows.length === 0) {
      console.log(`${npm} ini tidak terdaftar`)
      throw new AbsentFillerNotRegisteredError(`User ${npm} is not registered`)
    }

    if (rows[0].keterangan === null) {
      return false
    }

    return true
  }catch(e){
    if (e instanceof AbsentFillerNotRegisteredError) {
      return e
    }

    console.log(e)
  }
}

const checkRefIdExists = async (refId, tableName, rowName) => {
  const query = `SELECT COUNT(1) FROM ${tableName} WHERE ${rowName} = $1`
  const params = [refId]

  try {
    const { rows } = await testQuery(query, params)
    console.log('check if ref id exist', rows[0].count)

    if (rows[0].count < 1) {
      return false
    }

    return true
  } catch (e) {
    console.log(e)
  }
}

const insertKehadiranRecord = async (npm, refId, keterangan) => {
  const query = `UPDATE absensi SET keterangan = $1 WHERE npm = $2 AND referensi_id = $3`
  const params = [keterangan, npm, refId]

  try {
    await testQuery(query, params)
    return 'Success'
  } catch (e) {
    console.log(e)
    return 'Failed'
  }
}

const absentFiller = async (req, res)=> {
  const { refId, nama, npm, keterangan } = req.body

  try {
    const isAbsentFormExists = await checkRefIdExists(refId, 'absensi', 'referensi_id')

    if (!isAbsentFormExists) {
      res.status(404).json({ error: 'Absent Form Not Found' })
      return
    }

  } catch (e) {
    console.log(e);
  }

  try {
    const result = await checkAlreadyFilled(refId, npm, nama)

    if(result instanceof AbsentFillerNotRegisteredError) {
      res.status(400).json({ error: 'NPM not registered' })
      res.end()
      return
    }

    if (result === false) {
      try {
        const isSuccess = await insertKehadiranRecord(npm, refId, keterangan)

        if (isSuccess === 'Success') {
          res.status(200).json({ message: 'Success. Your attendance has been recorded' })
        }

        if (isSuccess === 'Failed') {
          res.status(500).json({ error: 'Failed. Please contact administrator for this error.'})
        }
      } catch (e) {
        console.log(e)
      }
    }

    if (result === true) {
      res.status(403).json({ error: 'Can\'t change attendance record.' })
    }
  } catch (e) {
    console.log(e);
  }


/*
  if (!result) {
    try {
      const query = `UPDATE ${table_name} SET ${kehadiran_field} ${comparation_operator} $1 WHERE ${ref_id_field} ${comparation_operator} $2 ${logical_and_operator} ${npm_field} ${comparation_operator} $3`
      const params = ['t', `${ref_id}`, `${npm}`]

      await db.query(query, params)
      return 'berhasil'
    }catch(e){
      console.log(e)
      return 'gagal'
    }
  }

  return 'sudah absen'
*/
}

module.exports = { absentFiller }
