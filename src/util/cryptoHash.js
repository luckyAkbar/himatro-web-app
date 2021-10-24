// performance result: creating and comparing take ~30ms each
require('dotenv').config();

const bcrypt = require('bcrypt');

const createHash = async (target) => {
  try {
    const salt = await bcrypt.genSalt(Number(process.env.HASH_ROUND));
    const result = await bcrypt.hash(target, salt);

    return result;
  } catch (e) {
    throw new Error('Failed hasing target_row');
  }
};

const compareHash = async (plain, hashed) => {
  try {
    const result = await bcrypt.compare(plain, hashed);
    return result;
  } catch (e) {
    throw new Error('Failed comparing hash');
  }
};

module.exports = {
  createHash,
  compareHash,
};
