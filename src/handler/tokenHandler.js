const {
  postForgotPasswordTokenFeature,
  getForgotPasswordTokenFeature,
} = require('../feature/forgotPasswordTokenFeature');

const postTokenHandler = async (req, res) => {
  const { tokenType } = req.params;

  switch (tokenType) {
    case 'forgot-password':
      await postForgotPasswordTokenFeature(req, res);
      break;

    default:
      res.sendStatus(404);
  }
};

const getTokenHandler = async (req, res) => {
  const { tokenType } = req.params;

  switch (tokenType) {
    case 'forgot-password':
      await getForgotPasswordTokenFeature(req, res);
      break;

    default:
      res.sendStatus(404);
  }
}

module.exports = {
  postTokenHandler,
  getTokenHandler,
};
