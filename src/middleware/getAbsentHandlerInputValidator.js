const { checkIsAbsentFormWriteable } = require('../util/newAbsentFiller');
const {
  sortByAbsentQueryValidator,
  absentModeValidator,
  absentIdValidator,
} = require('../util/newValidator');

const getAbsentHandlerInputValidator = async (req, res, next) => {
  // this middleware will validate and securing all input destructured below
  // otherwise, it isn't save to use that input.

  const { absentId } = req.params;
  const { mode, sortBy } = req.query;

  try {
    absentIdValidator(absentId);
    absentModeValidator(mode);
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
