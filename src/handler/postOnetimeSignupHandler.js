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

    if (rows[0].count === '0') {
      console.log('test');
      return false;
    }

    return true;
  } catch (e) {
    console.log(e);
    return false;
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

    if (rows[0].nama === 'dummy') {
      return false;
    }
    return true;
  } catch (e) {
    console.log(e);
    return true;
  }
};

const validateInputData = (data) => {
  const {
    nama,
    npm,
    email,
    formId,
  } = data;

  try {
    if (Object.keys(data).length !== 4) {
      return false;
    }

    if (!commonValidator(formId)) {
      return false;
    }

    if (!(nama && npm && email)) {
      return false;
    }

    if (!(namaValidator(nama) && npmValidator(npm) && emailValidator(email))) {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  }

  return true;
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
  try {
    const isDataValid = validateInputData(req.body);

    if (!isDataValid) {
      res.status(400).render('errorPage', {
        errorMessage: 'Input data invalid.',
      });
      return;
    }

    const {
      npm,
      email,
      formId,
    } = req.body;

    const isFormExits = await checkIfFormIdExists(formId);

    if (!isFormExits) {
      res.status(404).render('errorPage', {
        errorMessage: 'Not found. This form does not exists!',
      });
      return;
    }

    const isNpmExists = await checkIsNpmExists(npm);

    if (!isNpmExists) {
      res.status(404).render('errorPage', {
        errorMessage: 'Sorry, your NPM is not registered. Please contact admin to resolve.',
      });
      return;
    }

    const isAlreadySignup = await checkIsAlreadySignup(npm);

    if (isAlreadySignup) {
      res.status(403).render('errorPage', {
        errorMessage: 'Sorry, you can\'t change signup data. Please wait until that feature to be released.',
      });
      return;
    }

    const isEmailExists = await checkIsEmailExists(email, 'signupdata');

    if (isEmailExists) {
      res.status(400).render('errorPage', {
        errorMessage: 'Email already taken by another user. Please use a different one.',
      });
      return;
    }
    await insertSignupData(req.body);

    res.status(200).render('commonSuccess', {
      successMessage: 'Your data has been recorded. Please check your email regularly to get your login credentials.',
    });

    const userPassword = userPasswordGenerator(npm);

    await generateLoginCredential(req.body, userPassword);
    await initDataAnggotaBiasa(req.body);
    await initDataPengurus(npm);
    await sendLoginCredentialViaEmail(userPassword, req.body);
  } catch (e) {
    console.log(e);
    res.status(500).render('errorPage', {
      errorMessage: 'Internal Server Error. Please contact admin to resolve.',
    });
  }
};

module.exports = {
  postOnetimeSignupHandler,
  initOnetimeSignupHandler,
};
