const noSQLSanitizer = require('mongo-sanitize');
const { FormAttributeElement } = require('../../models/formAttributeElement');
const { CustomError } = require('../classes/CustomError');

const validateDynamicFormElementData = (shape)  => {
  const {
    elementTitle,
    datatype,
    isRequired,
    HTMLInputType,
    choices = null,
    maxLength = null,
    minLength = null,
    attributeName = elementTitle,
  } = shape;

  const formElementData = [
    elementTitle,
    datatype,
    isRequired,
    HTMLInputType,
    choices,
    maxLength,
    minLength,
    attributeName,
  ];

  formElementData.forEach((data) => {
    if (data === undefined) throw new CustomError(`'undefined' value is prohibited in form element data.`);
  })
}

const generateDynamicFormShapeFromInput = (formBody) => {
  // this function will fail if when calling 'formElement.validate()' and schema throwing an error.
  // you have to catch that error on the function caller only to maximize eficiency.

  if (!Array.isArray(formBody) || formBody.length === 0) throw new CustomError('Formbody must an array with > 0 elements.');

  const cleanFormBody = noSQLSanitizer(formBody);
  const formShape = [];

  cleanFormBody.forEach((shape) => {
    validateDynamicFormElementData(shape);

    const {
      elementTitle,
      datatype,
      isRequired,
      HTMLInputType,
      choices = null,
      maxLength = null,
      minLength = null,
      attributeName = elementTitle,
    } = shape;

    const formElement = new FormAttributeElement({
      elementTitle,
      datatype,
      attributeName,
      isRequired,
      HTMLInputType,
      choices,
      maxLength,
      minLength,
    });
    
    formElement.validate((err) => {
      if (err) throw err;
    });
    
    formShape.push(formElement);
  });

  return formShape;
};

module.exports = { generateDynamicFormShapeFromInput };