const getOnetimeSignupHandler = (req, res) => {
  res.status(200).render('signup');
};

module.exports = {
  getOnetimeSignupHandler,
};
