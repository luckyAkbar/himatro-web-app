require('dotenv').config()
const { testQuery } = require('../../db/connection')
const { checkRefIdExists } = require('../util/absentFiller')
const { refIdValidator, showValueValidator, modeValidator, sortByValidator } = require('../util/validator')

const getAbsentHandler = async (req, res) => {
  const { absentId } = req.query
  let { show, mode } = req.query

  if (mode === undefined || mode === '') {
    mode = 'input'
  }

  if (!absentId) {
    res.status(200)
    res.render('absensi')
    return false
  }

  const isAbsentIdValid = refIdValidator(absentId)
  const isShowValid = showValueValidator(show)
  const isModeValid = modeValidator(mode)

  if(!(isAbsentIdValid && isShowValid && isModeValid)) {
    res.status(400).json({ error: 'Query Data Invalid' })
    return false
  }

  if (mode === 'input') {
    try {
      const isAbsentFormExists = await checkRefIdExists(absentId.toLowerCase(), 'absensi', 'referensi_id')

      if (!isAbsentFormExists) {
        res.status(400).json({ error: 'Absent form doesn\'t exist or already closed!' })
        return
      }

      res.render('inputAbsensi', {
        absentId: absentId.toLowerCase()
      })
      return
    } catch (e) {
      console.log(e)
    }
  } else if (mode === 'view') {
    try {
      const absentFormResult = await getAbsentFormResult(absentId, show, req, res)
    } catch (e) {
      console.log(e)
    }
  } else {
    res.sendStatus(400)
  }
}

const getAbsentFormResult = async (absentId, show, req, res) => {
  absentId = absentId.toLowerCase()
  let sortBy = req.query.sortBy
  console.log(sortBy);

  if (req.query.sortBy) {
    if (!sortByValidator(sortBy)) {
      res.status(400).json({ error: 'Query Data Invalid' })
      return
    }
  } else {
    sortBy = 'npm'
  }

  console.log(sortBy);

  let query = `SELECT * FROM absensi WHERE referensi_id = $1 ORDER BY ${sortBy}`
  let params = [absentId]
  let data = {
    nama: '',
    npm: '',
    waktuPengisian: '',
    keterangan: ''
  }
  let result = []

  if (show !== 'all' && show >= 0 && show !== '') {
    query += ` LIMIT $3`
    params.push(show)
  }

  try {
    const { rows } = await testQuery(query, params)

    for (let i = 0; i < rows.length; i++) {
      data = {
        nama: rows[i].nama,
        npm: rows[i].npm,
        waktuPengisian: rows[i].waktu_pengisian,
        keterangan: rows[i].keterangan
      }
      result.push(data)
    }

    res.status(200).render('viewAbsent', {
      namaKegiatan: 'Lokakarya Himatro',
      dataHasilAbsensi: result,
      jumlah: result.length,
      absentId: absentId
    })
  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
}

const getUrl = (req) => {
  const protocol = req.protocol
  const host = req.hostname
  const port = process.env.SERVER_PORT
  const path = req.path
  const absentId = req.query.absentId
  const show = req.query.show

  if (show) {
    return `${protocol}://${host}:${port}${path}?absentId=${absentId}&show=${show}&sortBy=`
  }

  return `${protocol}://${host}:${port}${path}?absentId=${absentId}`
}

module.exports = { getAbsentHandler }
