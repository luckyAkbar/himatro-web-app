const { DynamicFormDetail } = require('../../models/dynamicForm');
const { CustomError } = require('../classes/CustomError');
const noSQLSanitizer = require('mongo-sanitize');
const { refIdValidator } = require('../util/validator');

const getFormShape = async (formId) => {
  const id = String(noSQLSanitizer(formId)).trim();

  try {
    if (!refIdValidator(id) || !id.startsWith('form')) throw new CustomError('Form ID invalid.');
  } catch (e) {
    throw e;
  }

  try {
    const now = new Date();
    const result = await DynamicFormDetail.findOne({ formId: id }, {
      formShape: 1,
      startAt: 1,
      closedAt: 1,
    });
  
    if (result === undefined || result === null) throw new CustomError('Form not found.');
    if (result.startAt > now) throw new CustomError('Form is still locked');
    if (result.closedAt < now) throw new CustomError('Form is not accepting new response.');

    return result.formShape;    
  } catch (e) {
    throw e
  }
}

module.exports = { getFormShape };