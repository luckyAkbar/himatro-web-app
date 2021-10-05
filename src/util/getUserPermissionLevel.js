const { QueryError } = require('../classes/QueryError');
const { testQuery } = require('../../db/connection');
const { getMinimumFeaturePermission } = require('./getMinimumFeaturePermission');
const { generateErrorEmail } = require('./email');

const getUserPermissionLevel = async (email) => {
  const query = `SELECT hak FROM jabatan WHERE jabatan_id = (
        SELECT jabatan_id FROM pengurus WHERE npm = (
            SELECT npm FROM anggota_biasa WHERE email = $1
            )
        )`;
  const params = [email];

  try {
    const { rows } = await testQuery(query, params);

    if (rows[0] === undefined) return 0;

    return Number(rows[0].hak);
  } catch (e) {
    if (e instanceof QueryError) {
      throw new QueryError('Failed to get user permission level');
    }

    console.log(e);
    return 0;
  }
};

const comparePermisionLevel = async ({ email, ip }) => {
  try {
    const userPermissionLevel = await getUserPermissionLevel(email);
    const featurePermissionLevel = await getMinimumFeaturePermission('feature004');

    if (featurePermissionLevel > userPermissionLevel) return false;
    return true;
  } catch (e) {
    await generateErrorEmail('failed to compare user permission level in socmed form validation method.Illegal access is possible', `issuer: ${email}, ip: ${ip}`);

    console.log(e);
    return false;
  }
};

module.exports = {
  getUserPermissionLevel,
  comparePermisionLevel,
};
