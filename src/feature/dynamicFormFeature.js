const noSQLSanitizer = require('mongo-sanitize');
const { CustomError } = require('../classes/CustomError');
const { DynamicFormDetail } = require('../../models/dynamicForm');
const { getFormShape } = require('../util/getFormShape');
const { createDynamicFormToken, verifyJWTToken } = require('../util/jwtToken');
const { validateDynamicFormBody } = require('../util/validateDynamicFormBody');
const { saveUserInputOnDynamicForm } = require('../util/saveUserInputOnDynamicForm');
const { formIdGenerator } = require('../util/generator');
const { generateDynamicFormShapeFromInput } = require('../util/generateDynamicFormShapeFromInput');
const { getDynamicFormRawResult } = require('../util/getDynamicFormRawResult');

const getFormShapeDataFeature = async (req, res) => {
  const { formId } = req.query;
  const { email } = req;

  try {
    const formShape = await getFormShape(formId);
    const formToken = createDynamicFormToken({ formId, email });
    res.status(200).json({ formShape, formToken });
  } catch (e) {
    res.status(400).json({ errorMessage: e.message });
  }
};

const postDynamicFormFeature = async (req, res) => {
  const { formToken } = req.body;

  try {
    const { formId, email } = verifyJWTToken(formToken);
    if (email !== req.email) throw new CustomError('Do you think i fool enough?');

    const formShape = await getFormShape(formId);
    validateDynamicFormBody(formShape, req.body);

    await saveUserInputOnDynamicForm(formId, formShape, req);
    res.status(200).json({ message: 'Terimakasih, data anda sudah tercatat.', URLRedirect: '/' });
  } catch (e) {
    res.status(e.httpErrorStatus).json({ errorMessage: e.message });
  }
};

const createDynamicFormFeature = async (req, res) => {
  const rawFormBody = noSQLSanitizer(req.body);
  const formId = formIdGenerator();
  const { email } = req;
  const {
    formBody,
    formTitle,
    startAt,
    closedAt,
    allowedAttempt,
    scope = null,
  } = rawFormBody;

  try {
    const formShape = generateDynamicFormShapeFromInput(formBody);
    const newDynamicForm = new DynamicFormDetail({
      formTitle,
      formShape,
      startAt,
      closedAt,
      formId,
      scope,
      allowedAttempt,
      issuer: email,
    });

    await newDynamicForm.save();
    res.status(201).json({ dynamicFormId: formId });
  } catch (e) {
    res.status(400).json({ errorMessage: e.message });
  }
};

const getDynamicFormInsight = async (req, res) => {
  const { formId } = noSQLSanitizer(req.query);

  try {
    const {
      awaitingParticipantsList,
      totalAlreadyFilled,
      totalAwaitingResponse,
      result,
    } = await getDynamicFormRawResult(formId);

    res.status(200).json({
      awaitingParticipantsList,
      result,
      totalAlreadyFilled,
      totalAwaitingResponse,
    });
  } catch (e) {
    res.status(e.httpErrorStatus).json({ errorMessage: e.message });
  }
};

module.exports = {
  createDynamicFormFeature,
  getFormShapeDataFeature,
  getDynamicFormInsight,
  postDynamicFormFeature,
};
