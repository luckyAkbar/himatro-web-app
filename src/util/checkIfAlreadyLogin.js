const { CustomError } = require('../classes/CustomError');
const { JWTInvalidError } = require('../classes/JWTInvalidError');
const { verifyJWTToken } = require('./jwtToken');

const checkIfAlreadyLogin = (req) => {
  const { cookies, email } = req;
  const err = new CustomError('Anda sudah login dan tidak bisa menggunakan fitur ini', 403);

  if (email) throw err; // only work if used inside protected route

  try {
    verifyJWTToken(cookies.jwt);
    throw err;
  } catch (e) {
    if (e instanceof JWTInvalidError) return;
    throw err;
  }
};

module.exports = { checkIfAlreadyLogin };
