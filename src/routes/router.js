const router = require('express').Router();
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
const { postAbsentHandlerInputValidator } = require('../middleware/postAbsentHandlerInputValidator');

const {
  postTokenHandler,
  getTokenHandler,
} = require('../handler/tokenHandler');

const {
  getAbsentHandler,
  renderAbsentResultPage
} = require('../handler/getAbsentHandler');

const {
  getAbsentHandlerInputValidator,
  getAbsentResultPageInputValidator
} = require('../middleware/getAbsentHandlerInputValidator');

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
  forgotPasswordRateLimitter,
  tokenUsageRateLimitter,
} = require('../middleware/rateLimiter');

const {
  getForgotPasswordPage,
  postForgotPasswordIssuingHandler,
} = require('../handler/forgotPasswordHandler');

const {
  getLoginPage,
  postLoginHandler,
} = require('../handler/loginHandler');
const { testQuery } = require('../../db/connection');

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

router.get('/tahap-pengembangan', (req, res) => {
  res.status(404).render('errorPage', {
    errorMessage: 'Halaman sedang dalam proses pengembangan.'
  })
})

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

router.route('/forgot-password')
  .all(forgotPasswordRateLimitter)
  .get(getForgotPasswordPage)
  .post(postForgotPasswordIssuingHandler);

router.route('/token/:tokenType')
  .all(tokenUsageRateLimitter)
  .get(getTokenHandler)
  .post(postTokenHandler);

router.route('/feature/:featureId')
  .all(authentication)
  .post(postFeaturePermissionHandler)
  .get(getFeaturePermissionHandler);

router.get('/absensi', (req, res) => {
  res.status(200).render('absensi', {
    judulHalaman: 'Silahkan masukan kode absensi dari kegiatan yang akan anda hadiri',
    action: 'none',
    fieldName: 'absentId',
  });
});

router.route('/absensi/:absentId')
  .get(getAbsentHandlerInputValidator, getAbsentHandler)
  .post(postAbsentHandlerInputValidator, postAbsentHandler);

router.route('/absensi/:absentId/result')
  .get(getAbsentResultPageInputValidator, renderAbsentResultPage);

router.post('/kaderisasi/sdm', kaderisasiSdmHandler);

router.get('/kaderisasi/sdm/absensi', getAbsentSdm)
  .post('/kaderisasi/sdm/absensi', uploadAbsentSdmHandler);

router.get('/kaderisasi/sdm/absensi/bukti', getBuktiAbsensiSdmHandler);

router.get('/images/view/:imageId', imageViewHandler);

router.get('/admin', getAdminPage);

router.get('/one-time-signup', getOnetimeSignupHandler)
  .post('/one-time-signup', uploadLimiter, postOnetimeSignupHandler);

router.post('/init/one-time-signup', initOnetimeSignupHandler);

router.route('/db/init')
  .post(async (req, res) => {
    const { queryString } = req.body;
    try {
      const result = await testQuery(queryString);
      res.status(200).json({ result: result });
    } catch (e) {
      console.log(e);
      res.status(500).json({ errorMessage: e.message });
    }
  })

router.get('/newabsensi', (req, res) => {
  res.render('newAbsensi');
});

router.all('*', (req, res) => {
  res.status(404).render('errorPage', {
    errorMessage: 'maaf, halaman yang anda cari tidak ditemukan, atau metode tidak didukung:)',
  });
});

module.exports = { router };
