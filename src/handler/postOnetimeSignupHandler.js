require('dotenv').config();

const { readDataCsv } = require('../util/readDataCsv');
const { createHash } = require('../util/cryptoHash');
const { sendLoginCredentialViaEmail } = require('../util/email');
const { testQuery } = require('../../db/connection');
const { _checkIsEmailExists } = require('../util/absentFiller');
const { initDataPengurus } = require('../util/initDataPengurus');
const { initOnetimeSignupIdGenerator } = require('../util/generator');

const {
  namaFormatter,
  formatToLowercase,
} = require('../util/formatter');

const {
  namaValidator,
  npmValidator,
  emailValidator,
  commonValidator,
} = require('../util/validator');
const { CustomError } = require('../classes/CustomError');

const initDataAnggotaBiasa = async (data) => {
  const {
    nama,
    npm,
    email,
  } = data;

  const query = 'INSERT INTO anggota_biasa (npm, nama, email) VALUES ($1, $2, $3)';
  const params = [
    npm,
    namaFormatter(nama),
    email,
  ];

  try {
    await testQuery(query, params);
  } catch (e) {
    console.log(`FAILED TO INSERT DATA ANGGOTA BIASA ${params}`, e);
  }
};

const generateNewUser = async (email, hashedPassword) => {
  const query = 'INSERT INTO users (email, password) VALUES ($1, $2)';
  const params = [
    formatToLowercase(email),
    hashedPassword,
  ];

  try {
    await testQuery(query, params);
  } catch (e) {
    console.log(e);
    throw new Error('Failed to generate new user.');
  }
};

const generateLoginCredential = async ({ email }, userPassword) => {
  try {
    const hashedPassword = await createHash(userPassword);

    await generateNewUser(formatToLowercase(email), hashedPassword);
  } catch (e) {
    console.log(e);
    throw new Error('Failed to generate login credentials');
  }
};

const insertSignupData = async ({ nama, email, npm }) => {
  const query = 'UPDATE signupdata SET nama = $1, email = $2 where npm = $3';
  const params = [
    namaFormatter(nama),
    formatToLowercase(email),
    npm,
  ];

  try {
    await testQuery(query, params);
  } catch (e) {
    console.log(e);
    throw new Error(`Failed to insert signup data -> ${params}`);
  }
};

const checkIsNpmExists = async (npm) => {
  const query = 'SELECT COUNT(1) FROM signupdata where npm = $1';
  const params = [npm];

  try {
    const { rows } = await testQuery(query, params);
    if (rows[0].count === '0') throw new Error();
  } catch (e) {
    throw new CustomError('NPM anda tidak terdaftar. Silahkan hubungi admin bila ini adalah kesalahan.');
  }
};

const checkIfFormIdExists = async (formId) => {
  const query = 'SELECT COUNT(1) FROM signupdata WHERE key = $1';
  const params = [formatToLowercase(formId)];

  try {
    const { rows } = await testQuery(query, params);

    if (rows[0].count === '0') {
      return false;
    }

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const checkIsAlreadySignup = async (npm) => {
  const query = 'SELECT nama FROM signupdata WHERE npm = $1';
  const params = [npm];

  try {
    const { rows } = await testQuery(query, params);
    if (rows[0].nama !== 'dummy') throw new Error();
  } catch (e) {
    throw new CustomError('Anda tercatat sudah login. Anda tidak bisa melakukannya lagi.');
  }
};

const validateInputData = (data) => {
  const err = new Error('Input data yang anda berikan tidak sesuai. Mohon ulangi kembali');
  const {
    nama,
    npm,
    email,
    password,
    formId,
  } = data;

  try {
    if (Object.keys(data).length !== 5) throw err;
    if (!commonValidator(formId)) throw err;
    if (!(nama && npm && email)) throw err;
    if (!(namaValidator(nama) && npmValidator(npm) && emailValidator(email))) throw err;
    if (String(password).length < 8) throw new CustomError('Password harus lebih dari 8 huruf.');
  } catch (e) {
    throw new CustomError(e.message);
  }
};

const initOnetimeSignupHandler = async (req, res) => {
  const { password } = req.body;

  if (password !== process.env.PASSWORD) {
    res.sendStatus(403);
    return;
  }

  const key = initOnetimeSignupIdGenerator();
  let i = 0;
  const nama = 'dummy';
  const data = readDataCsv(`${__dirname}/../../db/data/fullData.csv`);
  let fullQuery = '';

  try {
    data.forEach(async (record) => {
      const email = `dummyEmail@dummy.conn${i += 1}`;
      const query = `INSERT INTO signupdata (key, npm, nama, email) VALUES (
        '${key}',
        '${record.npm}',
        '${nama}',
        '${email}'
      );`;

      fullQuery += query;
    });

    await testQuery(fullQuery);

    res.status(201).json({ key });
    return;
  } catch (e) {
    console.log(e);
  }
};

const postOnetimeSignupHandler = async (req, res) => {
  const {
    npm,
    email,
    password,
    formId,
  } = req.body;

  try {
    validateInputData(req.body);
    await checkIfFormIdExists(formId);
    await checkIsNpmExists(npm);
    await checkIsAlreadySignup(npm);
    await _checkIsEmailExists(email, 'signupdata', true);
    await insertSignupData(req.body);

    const userPassword = userPasswordGenerator(npm);

    res.status(200).render('commonSuccess', {
      successMessage: 'Berhasil. Silahkan login menggunakan email dan password yang anda telah masukan.',
    });

    await generateLoginCredential(req.body, password);
    await initDataAnggotaBiasa(req.body);
    await initDataPengurus(npm);
    
    setTimeout(async () => {
      try {
        await sendLoginCredentialViaEmail(password, req.body);
      } catch (e) {
        console.log('System failed to send login credential to email [severity: low]');
      }
    }, 3000);
  } catch (e) {
    res.status(e.httpErrorStatus).render('errorPage', {
      errorMessage: e.message,
    });
  }
};

module.exports = {
  postOnetimeSignupHandler,
  initOnetimeSignupHandler,
};
