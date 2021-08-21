require('dotenv').config()

const { testQuery } = require('../../db/connection')
const { getNamaKegiatan } = require('../util/getNamaKegiatan')

const {
  checkRefIdExists,
  checkIsExpired
} = require('../util/absentFiller')

const {
  refIdValidator,
  showValueValidator,
  modeValidator,
  sortByValidator
} = require('../util/validator')

const getAbsentHandler = async (req, res) => {
  const { absentId } = req.query
  let { show, mode='input' } = req.query

  if (!absentId) {
    res.status(200)
    res.render('absensi', {
      judulHalaman: 'Silahkan masukan kode absensi dari kegiatan yang akan anda hadiri',
      action: '/absensi',
      fieldName: 'absentId'
    })
    return false
  }

  const isAbsentIdValid = refIdValidator(absentId)
  const isShowValid = showValueValidator(show)
  const isModeValid = modeValidator(mode)

  if(!(isAbsentIdValid && isShowValid && isModeValid)) {
    res.status(400).render('errorPage', {
      errorMessage: 'Query Data Invalid'
    })
    return false
  }

  if (mode === 'input') {
    try {
      const isAbsentFormExists = await checkRefIdExists(absentId.toLowerCase(), 'absensi', 'referensi_id')
      const isExpired = await checkIsExpired(absentId)

      if (!isAbsentFormExists) {
        res.status(404).render('errorPage', {
          errorMessage: 'Absent form doesn\'t exist'
        })
        return
      }

      if (isExpired) {
        res.status(404).render('errorPage', {
          errorMessage: 'Sorry, absent form already closed.',
        })
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
      const isAbsentFormExists = await checkRefIdExists(absentId.toLowerCase(), 'absensi', 'referensi_id')

      if (!isAbsentFormExists) {
        res.status(400).render('errorPage', {
          errorMessage: 'Absent form doesn\'t exist or already closed!'
        })
        return
      }

      const absentFormResult = await getAbsentFormResult(absentId, show, req, res)
    } catch (e) {
      console.log(e)
    }
  } else {
    res.status(418).render('errorPage', {
      errorMessage: 'Error: I\'m tea pot'
    })
  }
}

const getAbsentFormResult = async (absentId, show, req, res) => {
  absentId = absentId.toLowerCase()
  let sortBy = req.query.sortBy

  if (req.query.sortBy) {
    if (!sortByValidator(sortBy)) {
      res.status(400).render('errorPage', {
        errorMessage: 'Query Data Invalid'
      })
      return
    }
  } else {
    sortBy = 'waktu_pengisian'
  }

  let query = `SELECT * FROM absensi WHERE referensi_id = $1 ORDER BY ${sortBy}`
  let params = [absentId]
  let data = {
    nama: '',
    npm: '',
    waktuPengisian: '',
    keterangan: '',
    divisi: ''
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
        waktuPengisian: String(rows[i].waktu_pengisian).slice(16,24),
        keterangan: rows[i].keterangan,
        divisi: rows[i].divisi
      }
      result.push(data)
    }

    res.status(200).render('viewAbsent', {
      namaKegiatan: await getNamaKegiatan(absentId),
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
