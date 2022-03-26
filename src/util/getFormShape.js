const noSQLSanitizer = require('mongo-sanitize');
const { DynamicFormDetail } = require('../../models/dynamicForm');
const { CustomError } = require('../classes/CustomError');
const { refIdValidator } = require('./validator');

const getFormShape = async (formId) => {
  const id = String(noSQLSanitizer(formId)).trim();

  if (!refIdValidator(id) || !id.startsWith('form')) throw new CustomError('Form ID invalid.');

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
};

module.exports = { getFormShape };
