const noSQLSanitizer = require('mongo-sanitize');
const { ForgotPasswordToken } = require('../../models/forgotPassword');
const { CustomError } = require('../classes/CustomError');
const { verifyJWTToken } = require('../util/jwtToken');
const { testQuery } = require('../../db/connection');
const { getNPMFromEmail } = require('../util/getNPMFromEmail');
const { userPasswordGenerator } = require('../util/generator');
const { createHash } = require('../util/cryptoHash');
const { sendLoginCredentialViaEmail } = require('../util/email');

const validateTokenId = async (tokenId, userAgent) => {
  const token = String(noSQLSanitizer(tokenId));
  const err = new Error();

  try {
    const tokenSearchResult = await ForgotPasswordToken.findOneAndDelete({ _id: token });
    console.log(tokenSearchResult);

    if (token.length !== 24) throw err;
    if (tokenSearchResult.issuerUserAgent !== userAgent) throw err;

    verifyJWTToken(tokenSearchResult.token);

    return tokenSearchResult.issuerEmail;
  } catch (e) {
    throw new CustomError('Forgot password token is not authentic', 403);
  }
};

const changeUserPasswordOnDatabase = async (userEmail, hashedPassword) => {
  const query = 'UPDATE users SET password = $1 WHERE email = $2';
  const params = [hashedPassword, userEmail];

  try {
    await testQuery(query, params);
  } catch (e) {
    throw new CustomError('User password changing procedure has failed', 500);
  }
};

const performChangePasswordProcedure = async (emailTarget) => {
  try {
    const userNPM = await getNPMFromEmail(emailTarget);
    const newUserPassword = userPasswordGenerator(userNPM);
    const hashedPassword = await createHash(newUserPassword);

    await changeUserPasswordOnDatabase(emailTarget, hashedPassword);
    await sendLoginCredentialViaEmail(newUserPassword, { email: emailTarget });
  } catch (e) {
    throw new CustomError('System failed to perform password change.', 500);
  }
};

const forgotPasswordTokenFeature = async (req, res) => {
  const { tokenId } = noSQLSanitizer(req.query);
  const userAgent = req.headers['user-agent'];

  try {
    const emailTarget = await validateTokenId(tokenId, userAgent);
    await performChangePasswordProcedure(emailTarget);

    res.status(200).json({ message: 'Proses penggantian password berhasil, silahkan buka email anda untuk kredensial baru anda.' });
  } catch (e) {
    res.status(e.httpErrorStatus).json({ errorMessage: e.message });
  }
};

module.exports = { forgotPasswordTokenFeature };
