const chalk = require('chalk');

const { CustomError } = require('../classes/CustomError');
const { testQuery } = require('../../db/connection');
const { AbsentFillerNotRegisteredError } = require('../classes/AbsentFillerNotRegisteredError');
const { getTimeStamp } = require('./getTimeStamp');

const table_name = 'absensi';
const ref_id_field = 'referensi_id';
const keterangan_field = 'keterangan';
const npm_field = 'npm';

const checkAlreadyFilled = async (ref_id, npm) => {
  const err = new Error();
  console.log('WARNING. checkAlreadyFilled function is deprecated. Please change to supported one instead.');
  console.log(JSON.stringify(err));

  const query = `SELECT ${keterangan_field} FROM ${table_name} WHERE ${npm_field} = $1 AND ${ref_id_field} = $2`;
  const params = [npm, ref_id];

  try {
    const { rows } = await testQuery(query, params);

    if (rows.length === 0) {
      console.log(chalk.red(`${npm} ini tidak terdaftar`));
      return new AbsentFillerNotRegisteredError(`User ${npm} is not registered`);
    }

    if (rows[0].keterangan === null) {
      return false;
    }

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const checkIsEmailExists = async (email, tableName) => {
  const err = new Error();
  console.log('WARNING. checkIsEmailExists function is deprecated. Please change to _checkIsEmailExists.');
  console.log(JSON.stringify(err));

  const query = `SELECT COUNT(1) FROM ${tableName} WHERE email = $1`;
  const params = [email];

  try {
    const { rows } = await testQuery(query, params);

    if (rows[0].count === '0') {
      return false;
    }

    return true;
  } catch (e) {
    console.log(e);
    throw new Error('Failed to check whether email already exists or not.');
  }
};

const _checkIsEmailExists = async (email, tableName, throwErrorIfExists = false) => {
  const query = `SELECT * FROM ${tableName} WHERE email = $1`;
  const params = [email];

  try {
    const { rowCount } = await testQuery(query, params);
    if (rowCount === '0') throw new CustomError('Email not found!');
    if (rowCount !== 0 && throwErrorIfExists) throw new CustomError('Email anda sudah digunakan oleh orang lain. Mohon gunakan yang lain');
  } catch (e) {
    throw new CustomError(e.message);
  }
};

const checkIsExpired = async (absentId) => {
  const err = new Error();
  console.log('WARNING. checkIsExpired function is deprecated. Please change to supported one.');
  console.log(JSON.stringify(err));

  const query = 'select tanggal_berakhir from kegiatan where kegiatan_id = $1';
  const params = [absentId];

  try {
    const { rows } = await testQuery(query, params);
    const result = await testQuery('select now()');

    if (rows[0].tanggal_berakhir < result.rows[0].now) {
      return true;
    }

    return false;
  } catch (e) {
    console.log(chalk.red(e));
    throw new Error('Failed to compare time (is expired)');
  }
};

const checkIsAlreadyOpen = async (refId) => {
  const err = new Error();
  console.log('WARNING. checkIsAlreadyOpen function is deprecated. Please change to supported one instead.');
  console.log(JSON.stringify(err));

  const query = 'SELECT tanggal_pelaksanaan FROM kegiatan WHERE kegiatan_id = $1';
  const params = [refId];

  try {
    const { rows } = await testQuery(query, params);
    const now = await testQuery('select now()');

    if (rows[0].tanggal_pelaksanaan > now.rows[0].now) {
      return false;
    }
    return true;
  } catch (e) {
    console.log(chalk.red(e));
    throw new Error('Failed to compare time (already open)');
  }
};

const checkRefIdExists = async (refId, tableName, rowName) => {
  const err = new Error();
  console.log('WARNING. checkRefIdExists function is deprecated. Please change to supported one instead.');
  console.log(JSON.stringify(err));

  const query = `SELECT COUNT(1) FROM ${tableName} WHERE ${rowName} = $1`;
  const params = [refId];

  try {
    const { rows } = await testQuery(query, params);

    if (rows[0].count < 1) {
      return false;
    }

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const insertKehadiranRecord = async (data, now) => {
  const err = new Error();
  console.log('WARNING. insertKehadiranRecord function is deprecated. Please change to supported one instead.');
  console.log(JSON.stringify(err));

  const {
    npm,
    absentId,
    keterangan,
    alasan = null,
  } = data;

  const query = 'UPDATE absensi SET keterangan = $1, waktu_pengisian = $2, alasan_izin = $5 WHERE npm = $3 AND referensi_id = $4';
  const params = [keterangan, now, npm, absentId, alasan];

  try {
    await testQuery(query, params);
    return 'Success';
  } catch (e) {
    console.log(chalk.red(e));
    return 'Failed';
  }
};

const absentFiller = async (data, res) => {
  const err = new Error();
  console.log('WARNING. absentFiller function is deprecated. Please change to supported one instead.');
  console.log(JSON.stringify(err));

  const {
    absentId,
    npm,
    nama,
  } = data;
  try {
    const isAbsentFormExists = await checkRefIdExists(absentId, 'absensi', 'referensi_id');
    const isExpired = await checkIsExpired(absentId);

    if (!isAbsentFormExists) {
      res.status(404).render('errorPage', {
        errorMessage: 'Absent Form Not Found',
      });
      return;
    }

    if (isExpired) {
      res.status(404).render('errorPage', {
        errorMessage: 'Sorry, this absent already closed.',
      });
      return;
    }
  } catch (e) {
    console.log(chalk.red(e));
  }

  try {
    const result = await checkAlreadyFilled(absentId, npm);

    if (result instanceof AbsentFillerNotRegisteredError) {
      res.status(400).render('errorPage', {
        errorMessage: 'NPM not registered',
      });
      res.end();
      return;
    }

    if (result === false) {
      const now = getTimeStamp();
      try {
        const isSuccess = await insertKehadiranRecord(data, now);

        if (isSuccess === 'Success') {
          res.status(200).render('successAbsent', {
            nama,
            link: `/absensi?absentId=${absentId}&mode=view&sortBy=waktu_pengisian`,
          });
        }

        if (isSuccess === 'Failed') {
          res.status(500).render('errorPage', {
            errorMessage: 'Failed. Please contact administrator for this error.',
          });
        }
      } catch (e) {
        console.log(chalk.red(e));
      }
    }

    if (result === true) {
      res.status(403).render('errorPage', {
        errorMessage: 'Can\'t change attendance record.',
      });
    }
  } catch (e) {
    console.log(chalk.red(e));
  }
};

module.exports = {
  absentFiller,
  checkRefIdExists,
  checkIsExpired,
  checkIsAlreadyOpen,
  checkIsEmailExists,
  _checkIsEmailExists,
};
