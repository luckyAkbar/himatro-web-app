const { CustomError } = require('../classes/CustomError');
const { getFormShape } = require('../util/getFormShape');
const { createDynamicFormToken, verifyJWTToken } = require('../util/jwtToken');
const { validateDynamicFormBody } = require('../util/validateDynamicFormBody');
const { saveUserInputOnDynamicForm } = require('../util/saveUserInputOnDynamicForm');

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
    res.status(200).json({ message: 'OK sementara ini', URLRedirect: '/' });
  } catch (e) {
    res.status(400).json({ errorMessage: e.message });
  }
};

module.exports = {
  getFormShapeDataFeature,
  postDynamicFormFeature,
};
