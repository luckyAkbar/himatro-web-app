const { CustomError } = require('../classes/CustomError');
const { ForgotPasswordToken } = require('../../models/forgotPassword');

const getTokenDataFromForgotTokenId = async (forgotTokenId) => {
  try {
    const result = await ForgotPasswordToken.findOne({ _id: forgotTokenId });
    if (result === null) throw new Error('Token anda tidak dapat ditemukan.');
    
    return {
      issuerUserAgent: result.issuerUserAgent,
      token: result.token,
    };
  } catch (e) {
    throw new CustomError(e.message, 500);
  }
};

const getUserEmailFromForgotTokenId = async (forgotPasswordTokenId) => {
  const { issuerEmail } = await ForgotPasswordToken.findOne({ _id: forgotPasswordTokenId });
  return issuerEmail;
};

module.exports = {
  getTokenDataFromForgotTokenId,
  getUserEmailFromForgotTokenId,
};
