require('dotenv').config();

const jwt = require('jsonwebtoken');
const { JWTInvalidError } = require('../classes/JWTInvalidError');

const createJWTToken = (session, sessionId, email) => jwt.sign({
  session,
  sessionId,
  email,
}, process.env.SECRET_JWT_TOKEN, {
  expiresIn: Number(process.env.JWT_TOKEN_EXPIRES_SEC),
});

const verifyJWTToken = (token) => {
  const result = jwt.verify(token, process.env.SECRET_JWT_TOKEN, (err, decoded) => {
    if (err) {
      return new JWTInvalidError('Token is not authentic');
    }

    return decoded;
  });

  if (result instanceof JWTInvalidError) {
    throw new JWTInvalidError('Token is not authentic');
  } else {
    return result;
  }
};

const ocrToken = (filename, featureCode) => jwt.sign({
  filename,
  featureCode,
}, process.env.SECRET_JWT_TOKEN, {
  expiresIn: Number(process.env.JWT_TOKEN_EXPIRES_SEC),
});

const createDynamicFormToken = (formData) => {
  const {
    formId,
    email,
  } = formData;

  return jwt.sign({
    formId,
    email,
  }, process.env.SECRET_JWT_TOKEN, {
    expiresIn: Number(process.env.JWT_FORM_TOKEN_EXPIRES_SEC),
  });
};

const createForgotPasswordToken = (email) => {
  return jwt.sign({
    email
  }, process.env.SECRET_JWT_TOKEN, {
    expiresIn: Number(process.env.JWT_TOKEN_FORGOT_PASSWORD_EXPIRES_SEC),
  });
};

module.exports = {
  createJWTToken,
  verifyJWTToken,
  ocrToken,
  createDynamicFormToken,
  createForgotPasswordToken,
};
