const noSQLSanitizer = require('mongo-sanitize');
const { ForgotPasswordToken } = require('../../models/forgotPassword');
const { CustomError } = require('../classes/CustomError');
const { testQuery } = require('../../db/connection');
const { createHash } = require('../util/cryptoHash');
const { sendLoginCredentialViaEmail } = require('../util/email');
const { getUserEmailFromForgotTokenId } = require('../util/getDataFromTokenId');

const {
  validateNewUserPassword,
  validateForgotTokenId,
} = require('../util/newValidator');

const changeUserPasswordOnDatabase = async (userEmail, hashedPassword) => {
  const query = 'UPDATE users SET password = $1 WHERE email = $2';
  const params = [hashedPassword, userEmail];

  try {
    await testQuery(query, params);
  } catch (e) {
    throw new CustomError('User password changing procedure has failed', 500);
  }
};

const performChangePasswordProcedure = async (req, res) => {
  const { newPassword } = req.body;
  const { forgotTokenId } = req.cookies;

  try {
    const emailTarget = await getUserEmailFromForgotTokenId(forgotTokenId);
    const hashedPassword = await createHash(newPassword);
    await changeUserPasswordOnDatabase(emailTarget, hashedPassword);
    await sendLoginCredentialViaEmail(newPassword, { email: emailTarget });

    res.status(200).render('commonSuccess', {
      successMessage: 'Proses penggantian password berhasil. Silahkan login dengan kredensial baru anda.',
    });

    await ForgotPasswordToken.deleteOne({ _id: forgotTokenId });
  } catch (e) {
    throw new CustomError('System failed to perform password change.', 500);
  }
};

const postForgotPasswordTokenFeature = async (req, res) => {
  try {
    validateNewUserPassword(req.body);
    await validateForgotTokenId(req);
    await performChangePasswordProcedure(req, res);
  } catch (e) {
    res.status(e.httpErrorStatus).render('errorPage', {
      errorMessage: e.message,
    });
  }
};

const getForgotPasswordTokenFeature = async (req, res) => {
  const tokenId = noSQLSanitizer(req.query.tokenId);

  try {
    await validateForgotTokenId(req, tokenPlace = 'query');
    res.cookie('forgotTokenId', tokenId, {
      maxAge: 300000,
      httpOnly: true,
    });
    res.render('changePassword');
  } catch (e) {
    res.status(e.httpErrorStatus).render('errorPage', {
      errorMessage: e.message
    });
  }
};

module.exports = { postForgotPasswordTokenFeature, getForgotPasswordTokenFeature };
