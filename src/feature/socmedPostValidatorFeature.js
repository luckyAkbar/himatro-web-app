const { MulterError } = require('multer');
const { testQuery } = require('../../db/connection');
const { QueryError } = require('../classes/QueryError');
const { generateErrorEmail } = require('../util/email');
const { socmedPostIdGenerator } = require('../util/generator');
const { comparePermisionLevel } = require('../util/getUserPermissionLevel');
const { socmedFormUpload } = require('../util/multerImageUpload');
const { readDataCsv } = require('../util/readDataCsv');

const {
  commonTextValidator,
  tanggalValidator,
  refIdValidator,
  npmValidator,
} = require('../util/validator');

const checkIsAlreadyPresence = async (email, eventId) => {
  const query = `SELECT presence_status FROM generic_presence_detector WHERE
        expected_participant_id = (SELECT npm FROM anggota_biasa WHERE email = $1)
        AND event_id = $2`;

  const params = [
    email,
    eventId,
  ];

  try {
    const { rows } = await testQuery(query, params);

    if (rows[0].presence_status) return true;
    return false;
  } catch (e) {
    console.log(e);

    const errorMessage = 'system failure to query presence list on generic_presence_detector table';
    await generateErrorEmail(errorMessage);
    throw new QueryError(errorMessage);
  }
};

const getFormInformation = async (formId) => {
  const query = 'SELECT expired_at, start_at FROM socmed_post_validator WHERE id = $1';
  const params = [formId];

  try {
    const queryResult = await testQuery(query, params);
    return queryResult;
  } catch (e) {
    console.log(e);

    if (e instanceof QueryError) {
      await generateErrorEmail('Form id checking query failed recently.');
    }

    await generateErrorEmail('Uncaugth error happend recently in getting form information result.');
    return false;
  }
};

const initSocmedPostValidatorData = (data) => {
  if (!commonTextValidator(data.postName)) return false;
  if (!tanggalValidator(data.expiredAt)) return false;
  if (!tanggalValidator(data.startAt)) return false;
  if (!commonTextValidator(data.keyword)) return false;
  return true;
};

const checkIsFormAvailable = (startAt, expiredAt) => {
  const now = new Date();
  const start = new Date(startAt);
  const expired = new Date(expiredAt);

  if (expired < now) return false;
  if (start > now) return false;
  return true;
};

const initGenericPresenceDetectorList = async (eventId) => {
  const query = `INSERT INTO generic_presence_detector (
        event_id,
        expected_participant_id
    ) VALUES ($1, $2)`;

  const dataPengurus = readDataCsv(`${__dirname}/../../db/data/fullData.csv`);
  let params = [];

  try {
    dataPengurus.forEach(async (data) => {
      params = [
        eventId,
        data.npm,
      ];

      await testQuery(query, params);
    });
  } catch (e) {
    console.log(e);
    throw new QueryError('System has failed to init new generic presence list');
  }
};

const postSocmedFormCallback = async (req, res, err) => {
  const { npm } = req.body;
  const { formId } = req.params;

  if (!npmValidator(npm)) return;
  if (err instanceof MulterError) return;

  try {
    const query = `UPDATE generic_presence_detector
            SET presence_status = $1, key_data = $2
            WHERE event_id = $3 AND expected_participant_id = $4`;
    const params = [
      't',
      req.file.id,
      formId,
      npm,
    ];

    await testQuery(query, params);
  } catch (e) {
    if (e instanceof QueryError) {
      res.status(500).render('errorPage', {
        errorMessage: 'Server error. Please contact admin to resolve.',
      });
      return;
    }

    console.log(e);
    throw new Error('uncaugth exception caught in update generic presence form');
  }

  try {
    const query = 'INSERT INTO gambar (gambar_id, nama_gambar) VALUES ($1, $2)';
    const params = [
      req.file.id,
      req.file.realname,
    ];

    await testQuery(query, params);

    res.status(200).render('commonSuccess', {
      successMessage: 'Success. Your data has been recorded',
    });
  } catch (e) {
    console.log(e);
    throw new QueryError('Failed to complete operation to insert new gambar data');
  }
};

const registerNewSMPV = async (req, socmedPostValidatorId) => {
  const query = `INSERT INTO socmed_post_validator (
        id,
        post_name,
        start_at,
        expired_at,
        keyword,
        issuer
  ) VALUES ($1, $2, $3, $4, $5, $6)`;

  const {
    postName,
    startAt,
    expiredAt,
    keyword,
  } = req;

  const params = [
    socmedPostValidatorId,
    postName,
    startAt,
    expiredAt,
    keyword,
    req.email,
  ];

  try {
    await testQuery(query, params);
  } catch (e) {
    console.log(e);
    throw new QueryError('failed to register new SMPV');
  }
};

const initSocmedPostValidatorFeature = async (req, res) => {
  if (!initSocmedPostValidatorData(req.body)) {
    res.status(400).json({ errorMessage: 'Data invalid. Make sure you fill all the data and follow every constraint stated.' });
    return;
  }

  const socmedPostValidatorId = socmedPostIdGenerator();

  try {
    await registerNewSMPV(req, socmedPostValidatorId);

    res.status(201).json({
      successMessage: `Success. ${req.body.postName} post validator created.`,
      id: socmedPostValidatorId,
    });

    await initGenericPresenceDetectorList(socmedPostValidatorId);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      errorMessage: 'Post validator creation failed. Please contact administrator to fix this issue',
    });

    await generateErrorEmail('Socmed Post Validation feature creation was failed recently', `issuer: ${req.email}`);
  }
};

const getSocmedPostValidatorForm = async (req, res) => {
  const { formId } = req.params;

  if (!refIdValidator(formId)) {
    res.status(404).render('errorPage', {
      errorMessage: 'Invalid form id.',
    });
  }

  try {
    const isAllowed = await comparePermisionLevel(req);

    if (!isAllowed) {
      res.status(401).render('errorPage', {
        errorMessage: 'Forbidden.',
      });
      return;
    }
  } catch (e) {
    console.log(e);
  }

  try {
    const { rows, rowCount } = await getFormInformation(formId);

    if (rowCount === '0') {
      res.status(400).render('errorPage', {
        errorMessage: 'Form not found',
      });
      return;
    }

    if (!checkIsFormAvailable(rows[0].start_at, rows[0].expired_at)) {
      res.status(400).render('errorPage', {
        errorMessage: 'Form is not open yet or already closed',
      });
      return;
    }

    res.render('formPostValidation', {
      formId,
    });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};

const postSocmedPostValidatorForm = async (req, res) => {
  try {
    const { formId } = req.params;
    const { email } = req;
    const presenceStatus = await checkIsAlreadyPresence(email, formId);

    if (presenceStatus) {
      res.status(403).render('errorPage', {
        errorMessage: 'You are already fill this form.',
      });
      return;
    }

    await socmedFormUpload(req, res, async (err) => {
      try {
        await postSocmedFormCallback(req, res, err);
      } catch (e) {
        console.log(e);
      }
    });
  } catch (e) {
    console.log(e);

    generateErrorEmail('System failure detected on handling image uploading in socmed post form.', `Possible victim: ${req.email}`);
    res.status(500).render('errorPage', {
      errorMessage: 'Internal Server Error',
    });
  }
};

const getSMPVFormResult = async (req, res) => {
  res.sendStatus(418);
};

module.exports = {
  initSocmedPostValidatorFeature,
  getSocmedPostValidatorForm,
  postSocmedPostValidatorForm,
  getSMPVFormResult,
};
