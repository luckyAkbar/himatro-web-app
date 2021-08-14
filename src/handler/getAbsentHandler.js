const { testQuery } = require('../../db/connection')
const { checkRefIdExists } = require('../util/absentFiller')
const { refIdValidator, showValueValidator, modeValidator } = require('../util/validator')

const getAbsentHandler = async (req, res) => {
  const { absentId } = req.query
  let { show, mode } = req.query

  if (mode === undefined || mode === '') {
    mode = 'input'
  }

  if (absentId === undefined || absentId === '') {
    res.status(200)
    res.render('absensi')
    return
  }

  const isAbsentIdValid = refIdValidator(absentId)
  const isShowValid = showValueValidator(show)
  const isModeValid = modeValidator(mode)

  if(!(isAbsentIdValid && isShowValid && isModeValid)) {
    res.status(400).json({ error: 'Query Data Invalid' })
    return
  }

  if (mode === 'input') {
    try {
      const isAbsentFormExists = await checkRefIdExists(absentId, 'absensi', 'referensi_id')

      if (!isAbsentFormExists) {
        res.status(400).json({ error: 'Absent form doesn\'t exist or already closed!' })
        return
      }

      res.render('inputAbsensi', {
        absentId: absentId
      })
      return
    } catch (e) {
      console.log(e)
    }
  } else if (mode === 'view') {
    try {
      const absentFormResult = await getAbsentFormResult(absentId, show, res)
    } catch (e) {
      console.log(e)
    }
  } else {
    res.sendStatus(400)
  }


}

const getAbsentFormResult = async (absentId, show, res) => {
  let query = `SELECT * FROM absensi WHERE referensi_id = $1 ORDER BY npm`
  let params = [absentId]
  let data = {
    nama: '',
    npm: '',
    waktuPengisian: '',
    keterangan: ''
  }
  let result = []

  if (show !== 'all' && show >= 0 && show !== '') {
    query += ` LIMIT $2`
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
    console.log(result[0].nama);

    res.status(200).render('viewAbsent', {
      namaKegiatan: 'Rapat Pengurus Himatro',
      dataHasilAbsensi: result,
      jumlah: result.length
    })
  } catch (e) {
    res.sendStatus(500)
  }
}

module.exports = { getAbsentHandler }
