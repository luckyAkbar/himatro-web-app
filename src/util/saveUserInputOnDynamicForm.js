const noSQLSanitizer = require('mongo-sanitize');
const { CustomError } = require('../classes/CustomError');
const { XSSFilterOnTextInputType } = require('./XSSFilter');
const { FormData } = require('../../models/formData');

const saveUserInputOnDynamicForm = async (formId, formShape, { body, email }) => {
  const userInput = noSQLSanitizer(body);
  const warningMessageOnXSSAttempt = 'Kami mendeteksi adanya input yang tidak wajar. Mohon ulangi data yang anda kirim dan jangan bermain-main.';
  const inputObject = {};

  formShape.forEach((shape) => {
    const {
      attributeName,
      isRequired
    } = shape;
    const saveInputDataFromUser = XSSFilterOnTextInputType(userInput[attributeName]);

    if (isRequired && saveInputDataFromUser === '') throw new CustomError(warningMessageOnXSSAttempt);

    inputObject[attributeName] = saveInputDataFromUser;
  });

  try {
    const userInputInJSONString = JSON.stringify(inputObject);
    const finalFormData = new FormData({
      formId,
      data: userInputInJSONString,
      filler: email,
    });

    await finalFormData.save();
  } catch (e) {
    throw new CustomError('Failed to save user form data to Mongo Atlas', 500);
  } 
}

module.exports = { saveUserInputOnDynamicForm };
