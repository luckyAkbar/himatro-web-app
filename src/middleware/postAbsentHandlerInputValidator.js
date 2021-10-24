const { absentIdValidator } = require('../util/newValidator');

const {
  checkIsAbsentFormWriteable,
  validateAbsentFormInputData,
  checkIfUserAlreadyFilledAbsentForm,
} = require('../util/newAbsentFiller');

const postAbsentHandlerInputValidator = async (req, res, next) => {
  const { absentId } = req.params;
  const { npm } = req.body;
  const { body } = req;

  try {
    absentIdValidator(absentId);
    await validateAbsentFormInputData(body, absentId);
    await checkIsAbsentFormWriteable(absentId);
    await checkIfUserAlreadyFilledAbsentForm(npm, absentId);

    next();
  } catch (e) {
    res.status(e.httpErrorStatus).render('errorPage', {
      errorMessage: e.message,
    });
  }
};

module.exports = { postAbsentHandlerInputValidator };
