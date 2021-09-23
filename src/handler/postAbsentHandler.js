require('dotenv').config();
const chalk = require('chalk');

const { referensiIdGenerator } = require('../util/generator');

const {
  absentFiller,
  checkIsAlreadyOpen,
  checkIsExpired,
} = require('../util/absentFiller');

const {
  createNewAbsent,
  createNewKegiatan,
} = require('../util/createNewAbsent');

const {
  postAbsentDataValidator,
  validateAbsentRefData,
  modeValidator,
} = require('../util/validator');

const absentDataValidator = (data) => {
  const isAbsentDataValid = postAbsentDataValidator(data);
  return isAbsentDataValid;
};

const absentRefValidator = async (req) => {
  const { namaKegiatan, tanggalPelaksanaan, tanggalBerakhir } = req.body;

  if (!validateAbsentRefData(namaKegiatan, tanggalPelaksanaan, tanggalBerakhir)) {
    return false;
  }

  return true;
};

const createNewAbsentRecord = async (refId, req, res) => {
  const { ref } = req.query;

  if (ref === 'keg') {
    // look at the bottom
    try {
      await createNewAbsent(res, refId);
      await createNewKegiatan(refId, req.body);
      res.json({ refId: `${refId}` });
    } catch (e) {
      res.status(500).json({ error: 'Server Error' });
      return;
    }
    return;
  }

  if (ref === 'rap') {
    res.status(501).json({ error: 'Not Implemented' });
    return;
  }

  res.status(400).json({ error: 'Malformed Request ' });
};

const postAbsentHandler = async (req, res) => {
  if (req.query.mode === 'create') {
    try {
      const { password } = req.body;

      if (password !== process.env.PASSWORD) {
        res.sendStatus(403);
        return;
      }

      const validate = await absentRefValidator(req);

      if (!validate) {
        res.status(400).render('errorPage', {
          errorMessage: 'Data Kegiatan / Rapat Invalid',
        });
        return;
      }
    } catch (e) {
      res.sendStatus(500);
      console.log(chalk.red('Can\'t validate absent data', e));
    }

    const { ref } = req.query;
    const refId = referensiIdGenerator(ref);

    try {
      await createNewAbsentRecord(refId, req, res);
    } catch (e) {
      // res.sendStatus(500)
      console.log(chalk.red('cannot create new absent / kegiatan record', e));
    }
  }

  if (req.body.mode === 'post') {
    const {
      absentId, mode, alasan
    } = req.body;

    if (!modeValidator(mode)) {
      res.sendStatus(404);
      return;
    }

    if (!absentDataValidator(req.body) || alasan.trim() === '') {
      res.status(400).render('errorPage', {
        errorMessage: 'Data Absen Invalid. Make sure to fill all the data required.',
      });
      return;
    }

    try {
      const isAlreadyOpen = await checkIsAlreadyOpen(absentId);

      if (!isAlreadyOpen) {
        res.status(403).render('errorPage', {
          errorMessage: 'Sorry, this form is still locked',
        });
        return;
      }

      const isExpired = await checkIsExpired(absentId);

      if (isExpired) {
        res.status(403).render('errorPage', {
          errorMessage: 'Sorry, absent form already closed.',
        });
        return;
      }

      await absentFiller(req.body, res);
    } catch (e) {
      console.log(chalk.red(e));
    }
  }
};

module.exports = { postAbsentHandler };
