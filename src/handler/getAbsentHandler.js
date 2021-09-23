require('dotenv').config();
const chalk = require('chalk');

const { testQuery } = require('../../db/connection');
const { getNamaKegiatan } = require('../util/getNamaKegiatan');

const {
  checkRefIdExists,
  checkIsExpired,
  checkIsAlreadyOpen,
} = require('../util/absentFiller');

const {
  refIdValidator,
  showValueValidator,
  modeValidator,
  sortByValidator,
} = require('../util/validator');

const getAbsentFormResult = async (absentId, show, req, res) => {
  let { sortBy } = req.query;

  if (req.query.sortBy) {
    if (!sortByValidator(sortBy)) {
      res.status(400).render('errorPage', {
        errorMessage: 'Query Data Invalid',
      });
      return;
    }
  } else {
    sortBy = 'waktu_pengisian';
  }

  let query = `SELECT * FROM absensi WHERE referensi_id = $1 ORDER BY ${sortBy}`;
  const params = [absentId];
  let data = {
    nama: '',
    npm: '',
    waktuPengisian: '',
    keterangan: '',
    alasan: '',
    divisi: '',
  };
  const result = [];

  if (show !== 'all' && show >= 0 && show !== '') {
    query += ' LIMIT $3';
    params.push(show);
  }

  try {
    const { rows } = await testQuery(query, params);

    for (let i = 0; i < rows.length; i += 1) {
      data = {
        nama: rows[i].nama,
        npm: rows[i].npm,
        waktuPengisian: String(rows[i].waktu_pengisian).slice(16, 24),
        keterangan: rows[i].keterangan,
        alasan: rows[i].alasan_izin,
        divisi: rows[i].divisi,
      };
      result.push(data);
    }

    res.status(200).render('viewAbsent', {
      namaKegiatan: await getNamaKegiatan(absentId),
      dataHasilAbsensi: result,
      jumlah: result.length,
      absentId,
    });
  } catch (e) {
    console.log(chalk.red(e));
    res.sendStatus(500);
  }
};

const getAbsentHandler = async (req, res) => {
  const { absentId } = req.query;
  const { show, mode = 'input' } = req.query;

  if (!absentId) {
    res.status(200);
    res.render('absensi', {
      judulHalaman: 'Silahkan masukan kode absensi dari kegiatan yang akan anda hadiri',
      action: '/absensi',
      fieldName: 'absentId',
    });
    return;
  }

  const isAbsentIdValid = refIdValidator(absentId);
  const isShowValid = showValueValidator(show);
  const isModeValid = modeValidator(mode);

  if (!(isAbsentIdValid && isShowValid && isModeValid)) {
    res.status(400).render('errorPage', {
      errorMessage: 'Query Data Invalid',
    });
    return;
  }

  if (mode === 'input') {
    try {
      const isAbsentFormExists = await checkRefIdExists(absentId.toLowerCase(), 'absensi', 'referensi_id');

      if (!isAbsentFormExists) {
        res.status(404).render('errorPage', {
          errorMessage: 'Absent form doesn\'t exist',
        });
        return;
      }

      const isAlreadyOpen = await checkIsAlreadyOpen(absentId.toLowerCase());

      if (!isAlreadyOpen) {
        res.status(403).render('errorPage', {
          errorMessage: 'Sorry, this form is still locked',
        });
        return;
      }

      const isExpired = await checkIsExpired(absentId.toLowerCase());

      if (isExpired) {
        res.status(404).render('errorPage', {
          errorMessage: 'Sorry, absent form already closed.',
        });
        return;
      }

      res.render('inputAbsensi', {
        absentId: absentId.toLowerCase(),
      });
      return;
    } catch (e) {
      console.log(chalk.red(e));
    }
  } else if (mode === 'view') {
    try {
      const isAbsentFormExists = await checkRefIdExists(absentId.toLowerCase(), 'absensi', 'referensi_id');

      if (!isAbsentFormExists) {
        res.status(400).render('errorPage', {
          errorMessage: 'Absent form doesn\'t exist or already closed!',
        });
        return;
      }

      await getAbsentFormResult(absentId.toLowerCase(), show, req, res);
    } catch (e) {
      console.log(chalk.red(e));
    }
  } else {
    res.status(418).render('errorPage', {
      errorMessage: 'Error: I\'m a tea pot',
    });
  }
};

module.exports = { getAbsentHandler };
