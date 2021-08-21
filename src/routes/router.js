const router = require('express').Router()
const { getAbsentHandler } = require('../handler/getAbsentHandler')
const { postAbsentHandler } = require('../handler/postAbsentHandler')
const { uploadAbsentSdmHandler } = require('../handler/postUploadAbsentSdmHandler')
const { kaderisasiSdmHandler } = require('../handler/postKaderisasiSdmHandler')
const { getAbsentSdm } = require('../handler/getAbsentSdm')
const { imageViewHandler } = require('../handler/imageViewHandler')
const { getBuktiAbsensiSdmHandler } = require('../handler/getBuktiAbsensiSdmHandler')

router.get('/', (req, res) => {
  res.render('homePage')
}).all('/', (req, res) => {
  res.render('methodUnsupported')
})

router.get('/tentang', (req, res) => {
  res.render('underDevelopment')
})

router.get('/absensi', getAbsentHandler)
  .post('/absensi', postAbsentHandler)

router.get('/tahap-pengembangan', (req, res) => {
  res.render('underDevelopment')
})

router.get('/kontak', (req, res) => {
  res.render('underDevelopment')
})

router.get('/login', (req, res) => {
  res.render('underDevelopment')
})

router.post('/kaderisasi/sdm', kaderisasiSdmHandler)

router.get('/kaderisasi/sdm/absensi', getAbsentSdm)
  .post('/kaderisasi/sdm/absensi', uploadAbsentSdmHandler)

router.get('/kaderisasi/sdm/absensi/bukti', getBuktiAbsensiSdmHandler)

router.get('/images/view/:imageId', imageViewHandler)

router.all('*', (req, res) => {
  res.end('maaf, halaman yang anda cari tidak ditemukan, atau metode tidak didukung:)')
})

module.exports = { router }
