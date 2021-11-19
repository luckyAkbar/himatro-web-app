// user must not logged in.
// user access forgot password page
// user input valid email
// system resend url to click by the user with short expiry time to user old email (same email)
// url send with token
// if the url is'n clicked before it's exipired, system musn't change user password
// if the url clicked, token validate, system generate new password, store the encrypted on db, send the pw to user old email
// that's it.

const { ForgotPasswordToken } = require('../../models/forgotPassword');
const { _checkIsEmailExists } = require('../util/absentFiller');
const { checkIfAlreadyLogin } = require('../util/checkIfAlreadyLogin');
const { sendForgotPasswordEmailNotif } = require('../util/email');
const { createForgotPasswordToken } = require('../util/jwtToken');
const { emailValidator } = require('../util/validator');

const getForgotPasswordPage = (req, res) => {
  res.render('forgotPassword');
};

const postForgotPasswordIssuingHandler = async (req, res) => {
  const { userEmail } = req.body;
  if (!emailValidator(userEmail)) {
    res.status(400).json({ errorMessage: 'Email invalid.' });
    return;
  }

  try {
    await _checkIsEmailExists(userEmail, 'users');
    checkIfAlreadyLogin(req);
  } catch (e) {
    res.status(400).json({ errorMessage: e.message });
    return;
  }

  const issuerUserAgent = req.headers['user-agent'];
  const tokenForgotPassword = createForgotPasswordToken(userEmail);
  const forgotPasswordToken = new ForgotPasswordToken({
    issuerUserAgent,
    token: tokenForgotPassword,
    issuerEmail: userEmail,
  });

  try {
    const { _id } = await forgotPasswordToken.save();
    await sendForgotPasswordEmailNotif(userEmail, _id);

    res.status(200).json({ message: 'Sukses. Silahkan buka email anda untuk melanjutkan proses.' });
  } catch (e) {
    res.status(500).json({ errorMessage: 'Server gagal menangani proses penggantian password.' });
  }
};

module.exports = {
  postForgotPasswordIssuingHandler,
  getForgotPasswordPage,
};
