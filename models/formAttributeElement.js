const mongoose = require('mongoose');

const {
  formatToCamelCase,
  formatToCapitalizeEach,
} = require('../src/util/formatter');

const formAttributeElementSchema = new mongoose.Schema({
  elementTitle: {
    type: String,
    required: [true, 'Please provide element title in formAttributeSchema.'],
    set: (elementTitle) => formatToCapitalizeEach(elementTitle),
  },

  datatype: {
    type: String,
    required: [true, 'Please provide data type for form attribute.'],
    lowercase: true,
    enum: {
      values: ['string', 'number'],
      message: 'We still not support {VALUE} data type in form attribute',
    },
    default: 'string',
  },

  attributeName: {
    type: String,
    required: [true, 'Please provide attribute name in form atribute schema.'],
    set: (attributeName) => formatToCamelCase(attributeName),
  },

  isRequired: {
    type: Boolean,
    required: true,
    default: true,
  },

  HTMLInputType: {
    type: String,
    required: [true, 'Please determine HTML input type for this form attribute.'],
    enum: {
      values: ['text', 'radio', 'checkbox'],
      message: '{VALUE} is not supported yet. Please use supported type.',
    },
  },

  choices: {
    type: Array,
    required: false,
  },

  maxLength: {
    type: Number,
    required: false,
    validate: {
      validator: (maxLength) => {
        if (maxLength <= 0) return false;
        return true;
      },
      message: 'Max length value can not have 0 or negative value.',
    },
  },

  minLength: {
    type: Number,
    required: false,
    validate: {
      validator: (minLength) => {
        if (minLength < 0) return false;
      },
      message: 'Min length can not have negative value.',
    },
  },
}, { _id: false });

const FormAttributeElement = mongoose.model('FormAttributeElement', formAttributeElementSchema);

module.exports = { FormAttributeElement };
