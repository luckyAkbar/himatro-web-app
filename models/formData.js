const mongoose = require('mongoose');
const { emailValidator } = require('../src/util/validator');

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
    minLength: 1,
    validate: {
      validator: (filler) => emailValidator(filler),
      message: 'Please use valid email as filler data.',
    },
  },
}, { timestamps: true });

const FormData = mongoose.model('FormData', formData);

module.exports = { FormData };
