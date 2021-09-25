require('dotenv').config();

const { readDataCsv } = require('../util/readDataCsv');
const { createHash } = require('../util/cryptoHash');
const { sendEmail } = require('../util/email');
const { testQuery } = require('../../db/connection');
const { checkIsEmailExists } = require('../util/absentFiller');
const { initDataPengurus } = require('../util/initDataPengurus');

const {
  namaFormatter,
  formatToLowercase,
} = require('../util/formatter');

const {
  initOnetimeSignupIdGenerator,
  userPasswordGenerator,
} = require('../util/generator');

const {
  namaValidator,
  npmValidator,
  emailValidator,
  commonValidator,
} = require('../util/validator');

const initDataAnggotaBiasa = async (data) => {
  const {
    nama,
    npm,
    email,
  } = data;

  const query = 'INSERT INTO anggota_biasa (npm, nama, email) VALUES ($1, $2, $3)';
  const params = [
    npm,
    nama,
    email,
  ];

  try {
    await testQuery(query, params);
  } catch (e) {
    console.log(`FAILED TO INSERT DATA ANGGOTA BIASA ${params}`, e);
  }
};

const sendLoginCredentialViaEmail = async (password, { email }) => {
  const message = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Your Login Credentials for Himatro Web App',
    html: `<h2 style="text-align:center;">Himatro Web App Login Credentials</h2>
            <p>Thanks for being patience and also thanks for sparing some time to fill out the previous form to get your login credentials.</p>
            <p>Just a quick reminder, this credentials <strong>SHOULD NEVER SHARED TO ANYONE ELSE</strong> because it's your secret, and it's your responsibility to keep it as secure as possible.</p>
            <p>This is your credentials: </p>
            <ul>
                <li>email: ${formatToLowercase(email)}</li>
                <li>password: ${password}</li>
            </ul>
            <p>One quick thing before you leave, have you mention something that needed to be improved from this web app? Or, do you want to join us in the developers team? Let me know all your thought about this app by simply replying / send us an email trough this mail. <strong>EVERY SINGLE CONTRIBUTION WILL BE MUCH VALUED</strong></p>
            <br>
            <p>Regards,</p>
            <h3>Lucky Akbar</h3>
            <p>Head of Developers @Himatro Web App developers team</p>
            `,
  };

  try {
    await sendEmail(message);
  } catch (e) {
    console.log(e);
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
  /*
  const { password } = req.body;

  if (password !== process.env.PASSWORD) {
    res.sendStatus(403);
    return;
  }

  */

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
    console.log(req.body)
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
