const router = require('express').Router();
const { getAbsentHandler } = require('../handler/getAbsentHandler');
const { getNewAbsentHandler } = require('../handler/getNewAbsentHandler');
const { postAbsentHandler } = require('../handler/postAbsentHandler');
const { uploadAbsentSdmHandler } = require('../handler/postUploadAbsentSdmHandler');
const { kaderisasiSdmHandler } = require('../handler/postKaderisasiSdmHandler');
const { getAbsentSdm } = require('../handler/getAbsentSdm');
const { imageViewHandler } = require('../handler/imageViewHandler');
const { getBuktiAbsensiSdmHandler } = require('../handler/getBuktiAbsensiSdmHandler');
const { authentication } = require('../middleware/authentication');
const { getOnetimeSignupHandler } = require('../handler/getOnetimeSignupHandler');
const { logoutHandler } = require('../handler/logoutHandler');
const { getAdminPage } = require('../handler/getAdminPage');
const { getProfile } = require('../handler/getProfileHandler');
const { updateProfile } = require('../handler/postUpdateProfileHandler');
const { getUpdateProfile } = require('../handler/getUpdateProfile');

const {
  postFeaturePermissionHandler,
  getFeaturePermissionHandler,
} = require('../handler/featurePermissionHandler');

const {
  getFormHandler,
  postFormHandler,
} = require('../handler/formHandler');

const {
  postOnetimeSignupHandler,
  initOnetimeSignupHandler,
} = require('../handler/postOnetimeSignupHandler');

const {
  loginLimiter,
  uploadLimiter,
} = require('../middleware/rateLimiter');

const {
  getLoginPage,
  postLoginHandler,
} = require('../handler/loginHandler');

router.get('/', (req, res) => {
  res.render('homePage');
}).all('/', (req, res) => {
  res.status(400).render('errorPage', {
    errorMessage: 'maaf, halaman yang anda cari tidak ditemukan, atau metode tidak didukung:)',
  });
});

router.get('/tentang', (req, res) => {
  res.status(404).render('errorPage', {
    errorMessage: 'Halaman sedang dalam proses pengembangan',
  });
});

router.get('/absensi', getAbsentHandler)
  .post('/absensi', postAbsentHandler);

router.get('/tahap-pengembangan', (req, res) => {
  res.status(404).render('errorPage', {
    errorMessage: 'Halaman sedang dalam proses pengembangan',
  });
});

router.get('/kontak', (req, res) => {
  res.status(404).render('errorPage', {
    errorMessage: 'Halaman sedang dalam proses pengembangan',
  });
});

router.get('/login', getLoginPage)
  .post('/login', loginLimiter, postLoginHandler);

router.get('/logout', logoutHandler);

router.all('/profile', authentication)
  .get('/profile', getProfile);

router.route('/profile/update')
  .all(authentication)
  .get(getUpdateProfile)
  .put(updateProfile);

router.route('/form/:formType/:formId')
  .all(authentication)
  .get(getFormHandler)
  .post(postFormHandler);

router.post('/kaderisasi/sdm', kaderisasiSdmHandler);

router.get('/kaderisasi/sdm/absensi', getAbsentSdm)
  .post('/kaderisasi/sdm/absensi', uploadAbsentSdmHandler);

router.get('/kaderisasi/sdm/absensi/bukti', getBuktiAbsensiSdmHandler);

router.get('/images/view/:imageId', imageViewHandler);

router.get('/admin', authentication, getAdminPage);

router.post('/feature/:featureId', authentication, featurePermissionHandler);

router.get('/one-time-signup', getOnetimeSignupHandler)
  .post('/one-time-signup', uploadLimiter, postOnetimeSignupHandler);

router.post('/init/one-time-signup', initOnetimeSignupHandler);

router.get('/newabsensi', (req, res) => {
  res.render('newAbsensi')});

router.all('*', (req, res) => {
  res.status(404).render('errorPage', {
    errorMessage: 'maaf, halaman yang anda cari tidak ditemukan, atau metode tidak didukung:)',
  });
});

module.exports = { router };
