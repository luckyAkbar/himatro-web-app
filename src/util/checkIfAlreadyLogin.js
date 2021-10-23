const { CustomError } = require('../classes/CustomError');

const checkIfAlreadyLogin = (req) => {
  const { cookies, email } = req;
  if (email || cookies.jwt) throw new CustomError('You are signed in. You can not use this feature');
};

module.exports = { checkIfAlreadyLogin };
