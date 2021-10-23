const mongoose = require('mongoose');
const { emailValidator } = require('../src/util/validator');

const forgotPasswordTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: [true, 'Please input token for forgot password schema'],
  },

  issuerEmail: {
    type: String,
    required: [true, 'Please input issuer email in forgot password schema.'],
    validate: {
      validator: (issuerEmail) => emailValidator(issuerEmail),
      message: 'Please use valid email in issuer email field',
    },
  },

  issuerUserAgent: {
    type: String,
    required: [true, 'Please input user agent in forgot password shcema'],
  },

  validUntil: {
    type: Number,
    required: [true, 'Please specify validation date for forgot password token'],
    default: () => Date.now() + (process.env.JWT_TOKEN_FORGOT_PASSWORD_EXPIRES_SEC * 1000),
  },
}, { timestamps: true });

const ForgotPasswordToken = mongoose.model('ForgotPassword', forgotPasswordTokenSchema);

module.exports = { ForgotPasswordToken };
