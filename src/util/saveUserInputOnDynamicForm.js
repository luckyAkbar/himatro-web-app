const { CustomError } = require('../classes/CustomError');
const noSQLSanitizer = require('mongo-sanitize');
const { XSSFilterOnTextInputType } = require('../util/XSSFilter');
const { FormData } = require('../../models/formData');

const saveUserInputOnDynamicForm = async (formId, formShape, { body, email }) => {
  const userInput = noSQLSanitizer(body);
  const warningMessageOnXSSAttempt = 'Kami mendeteksi adanya input yang tidak wajar. Mohon ulangi data yang anda kirim dan jangan bermain-main.';
  let inputObject = {};
  
  formShape.forEach((shape) => {
    const attributeName = shape.attributeName;
    const isRequired = shape.isRequired;
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
    res.sendStatus(500);
  } 
}

module.exports = { saveUserInputOnDynamicForm };