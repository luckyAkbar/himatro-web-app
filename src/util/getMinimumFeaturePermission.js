const { QueryError } = require('../classes/QueryError');
const { testQuery } = require('../../db/connection');

const getMinimumFeaturePermission = async (featureId) => {
  const query = 'SELECT permission_level FROM feature_permission WHERE feature_id = $1';
  const params = [featureId];

  try {
    const { rows } = await testQuery(query, params);
    return Number(rows[0].permission_level);
  } catch (e) {
    throw new QueryError('Failed to get minimum feature permision level.');
  }
};

module.exports = { getMinimumFeaturePermission };
