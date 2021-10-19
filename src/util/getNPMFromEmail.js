const { testQuery } = require('../../db/connection');

const getNPMFromEmail = async (email) => {
  const query = 'SELECT npm FROM anggota_biasa WHERE email = $1';
  const params = [email];

  try {
    const NPM = await testQuery(query, params);
    return NPM;
  } catch (e) {
    throw new CustomError('Server failed to resolve NPM from given email', 500);
  }
};

module.exports = { getNPMFromEmail };
