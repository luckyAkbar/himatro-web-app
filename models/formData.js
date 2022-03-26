const mongoose = require('mongoose');
const { npmValidator } = require('../src/util/validator');

const formData = mongoose.Schema({
  formId: {
    type: String,
    required: [true, 'Please provide formId before saving form data.'],
  },

  data: {
    type: String,
    required: [true, 'Please provide json data in data field.'],
  },

  filler: {
    type: String,
    minLength: 10,
    maxLength: 10,
    validate: {
      validator: (filler) => npmValidator(filler),
      message: 'Please use valid NPM as filler data.',
    },
  },
}, { timestamps: true });

const FormData = mongoose.model('FormData', formData);

module.exports = { FormData };
