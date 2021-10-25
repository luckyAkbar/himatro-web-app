const {
  checkIsAbsentFormWriteable,
  checkIfUserAlreadyFilledAbsentForm,
} = require('../util/newAbsentFiller');

const {
  sortByAbsentQueryValidator,
  absentIdValidator,
} = require('../util/newValidator');

const getAbsentHandlerInputValidator = async (req, res, next) => {
  // this middleware will validate and securing all input destructured below
  // otherwise, it isn't save to use that input.

  const { absentId } = req.params;
  const { sortBy } = req.query;

  try {
    absentIdValidator(absentId);
    sortByAbsentQueryValidator(sortBy);
    await checkIsAbsentFormWriteable(absentId);

    next();
  } catch (e) {
    res.status(e.httpErrorStatus).render('errorPage', {
      errorMessage: e.message,
    });
  }
};

module.exports = { getAbsentHandlerInputValidator };
