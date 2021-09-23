const chalk = require('chalk');
const { verifyJWTToken } = require('../util/jwtToken');
const { getSecondsAfterEpoch } = require('../util/getTimeStamp');
const { testQuery } = require('../../db/connection');

const clearExpiredSession = async () => {
  const query = 'DELETE FROM sessions where $1 > expired';
  const params = [getSecondsAfterEpoch()];

  try {
    await testQuery(query, params);
  } catch (e) {
    console.log(e);
  }
};

const authentication = async (req, res, next) => {
  const { jwt } = req.cookies;

  try {
    await clearExpiredSession();
  } catch (e) {
    console.log('error clearing expired session', e);
  }

  if (!jwt) {
    res.status(403).redirect('/login');
    return;
  }

  const query = 'SELECT * FROM sessions WHERE sessionid = $1';
  try {
    const {
      sessionId, session, exp, email,
    } = verifyJWTToken(jwt);

    if (getSecondsAfterEpoch() > exp) {
      res.status(403).redirect('/login');
      return;
    }

    const params = [sessionId];

    const { rowCount, rows } = await testQuery(query, params);

    if (rowCount === 0) {
      res.status(403).json({ errorMessage: 'Invalid session issued. Please login first' });
      return;
    }

    if (session !== rows[0].session && req.headers['user-agent'] !== rows[0].useragent) {
      res.status(403).json({ errorMessage: 'Unauthorized token usage. Please login first.' });
      return;
    }

    req.email = email;
    next();
    return;
  } catch (e) {
    console.log(chalk.white.bold.bgRed(`Unothorized access detected on ${req.path}. jwt: ${jwt}`));
    res.status(403).redirect('/login');
  }
};

module.exports = { authentication };
