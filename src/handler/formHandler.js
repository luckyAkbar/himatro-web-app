const {
  getSocmedPostValidatorForm,
  postSocmedPostValidatorForm,
  getSMPVFormResult,
} = require('../feature/socmedPostValidatorFeature');

const {
  getDynamicFormHandler,
} = require('./dynamicFormHandler');

const formResultHandler = async (req, res) => {
  const { formId } = req.params;

  switch (formId) {
    case 'smpv':
      await getSMPVFormResult(req, res);
      break;

    default:
      res.status(404).render('errorPage', {
        errorMessage: 'Not Found vangke.',
      });
  }
};

const getFormHandler = async (req, res) => {
  const { formType } = req.params;

  switch (formType) {
    case 'smpv':
      await getSocmedPostValidatorForm(req, res);
      break;

    case 'dynamic':
      await getDynamicFormHandler(req, res);
      break;

    case 'result':
      formResultHandler(req, res);
      break;

    default:
      res.status(404).render('errorPage', {
        errorMessage: 'Not Found.',
      });
  }
};

const postFormHandler = async (req, res) => {
  const { formType } = req.params;

  switch (formType) {
    case 'smpv':
      await postSocmedPostValidatorForm(req, res);
      break;

    default:
      res.status(404).render('errorPage', {
        errorMessage: 'Not Found.',
      });
  }
};

module.exports = {
  getFormHandler,
  postFormHandler,
};
