const { CustomError } = require('../classes/CustomError');
const { testQuery } = require('../../db/connection');

const getNPMFromEmail = async (email, targetTable = 'anggota_biasa') => {
  const query = `SELECT npm FROM ${targetTable} WHERE email = $1`;
  const params = [email];

  try {
    const { rows, rowCount } = await testQuery(query, params);

    if (rowCount === 0) throw new CustomError('Email not found.', 404);
    return rows[0].npm;
  } catch (e) {
    throw new CustomError(e.message, 404);
  }
};

module.exports = { getNPMFromEmail };
