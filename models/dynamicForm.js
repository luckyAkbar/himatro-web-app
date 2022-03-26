const mongoose = require('mongoose');
const { formatToCapitalizeEach } = require('../src/util/formatter');
const { emailValidator } = require('../src/util/validator');
const { FormAttributeElement } = require('./formAttributeElement');
const { formIdGenerator } = require('../src/util/generator');

const dynamicFormDetails = new mongoose.Schema({
  formId: {
    type: String,
    required: true,
    unique: true,
    maxLength: 10,
    default: formIdGenerator(),
  },

  formTitle: {
    type: String,
    required: [true, 'Please provide form title.'],
    set: (formTitle) => formatToCapitalizeEach(formTitle),
  },

  scope: {
    type: String,
    default: null,
  },

  allowedAttempt: {
    type: Number,
    default: 1,
    validate: {
      validator: (allowedAttempt) => allowedAttempt > 0,
      message: 'Please use correct input for allowed attempt ( > 0 )',
    },
  },

  issuer: {
    type: String,
    required: [true, 'Please provide issuer email on form detail.'],
    lowercase: true,
    validate: {
      validator: (issuer) => emailValidator(issuer),
      message: 'Please makse sure use correct email format in issuer field on form detail attribute.',
    },
  },

  startAt: {
    type: Date,
    required: [true, 'please provide date on startAt attribute.'],
  },

  closedAt: {
    type: Date,
    required: [true, 'Please provide date on closedAt attribute'],
  },

  formShape: {
    type: Array,
    required: [true, 'Please provide form shape in form details.'],
    validate: {
      validator: (formShape) => {
        for (let i = 0; i < formShape.length; i += 1) {
          if (!(formShape[i] instanceof FormAttributeElement)) return false;
        }
        return true;
      },
      message: 'Form body only can be instance of FormAttributeElement',
    },
  },
}, { timestamps: true });

const DynamicFormDetail = mongoose.model('DynamicFormDetail', dynamicFormDetails);

module.exports = { DynamicFormDetail };
