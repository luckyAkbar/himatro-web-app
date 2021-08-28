const router = require('express').Router()
const { getAbsentHandler } = require('../handler/getAbsentHandler')
const { postAbsentHandler } = require('../handler/postAbsentHandler')
const { uploadAbsentSdmHandler } = require('../handler/postUploadAbsentSdmHandler')
const { kaderisasiSdmHandler } = require('../handler/postKaderisasiSdmHandler')
const { getAbsentSdm } = require('../handler/getAbsentSdm')
const { imageViewHandler } = require('../handler/imageViewHandler')
const { getBuktiAbsensiSdmHandler } = require('../handler/getBuktiAbsensiSdmHandler')
const { authentication } = require('../middleware/authentication')

const { loginLimiter } = require('../middleware/rateLimiter')

const {
  getLoginPage,
  postLoginHandler,
} = require('../handler/loginHandler')

router.get('/', (req, res) => {
  res.render('homePage')
}).all('/', (req, res) => {
  res.status(400).render('errorPage', {
    errorMessage: 'maaf, halaman yang anda cari tidak ditemukan, atau metode tidak didukung:)'
  })
})

router.get('/tentang', (req, res) => {
  res.status(404).render('errorPage', {
    errorMessage: 'Halaman sedang dalam proses pengembangan'
  })
})

router.get('/absensi', getAbsentHandler)
  .post('/absensi', postAbsentHandler)

router.get('/tahap-pengembangan', (req, res) => {
  res.status(404).render('errorPage', {
    errorMessage: 'Halaman sedang dalam proses pengembangan'
  })
})

router.get('/kontak', (req, res) => {
  res.status(404).render('errorPage', {
    errorMessage: 'Halaman sedang dalam proses pengembangan'
  })
})

router.get('/login', getLoginPage)
  .post('/login', loginLimiter, postLoginHandler)

router.post('/kaderisasi/sdm', kaderisasiSdmHandler)

router.get('/kaderisasi/sdm/absensi', getAbsentSdm)
  .post('/kaderisasi/sdm/absensi', uploadAbsentSdmHandler)

router.get('/kaderisasi/sdm/absensi/bukti', getBuktiAbsensiSdmHandler)

router.get('/images/view/:imageId', imageViewHandler)

router.get('/protected/route', authentication)

router.all('*', (req, res) => {
  res.status(404).render('errorPage', {
    errorMessage: 'maaf, halaman yang anda cari tidak ditemukan, atau metode tidak didukung:)'
  })
})

module.exports = { router }
