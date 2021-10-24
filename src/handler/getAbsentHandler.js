const { testQuery } = require('../../db/connection');
const { getNamaKegiatan } = require('../util/getNamaKegiatan');

const prettifyAbsentResultData = (rawAbsentResult) => {
  const result = [];

  for (let i = 0; i < rawAbsentResult.length; i += 1) {
    data = {
      nama: rawAbsentResult[i].nama,
      npm: rawAbsentResult[i].npm,
      waktuPengisian: String(rawAbsentResult[i].waktu_pengisian).slice(16, 24),
      keterangan: rawAbsentResult[i].keterangan,
      alasan: rawAbsentResult[i].alasan_izin,
      divisi: rawAbsentResult[i].divisi,
    };
    result.push(data);
  }

  return result;
};

const renderAbsentResultPage = async (req, res) => {
  const { absentId } = req.params;
  const { sortBy } = req.query;
  const query = sortBy ? `SELECT * FROM absensi WHERE referensi_id = $1 ORDER BY ${sortBy}`
    : 'SELECT * FROM absensi WHERE referensi_id = $1 ORDER BY waktu_pengisian';
  const params = [absentId];

  try {
    const { rows } = await testQuery(query, params);
    const namaKegiatan = await getNamaKegiatan(absentId);
    const result = prettifyAbsentResultData(rows);

    res.status(200).render('viewAbsent', {
      namaKegiatan,
      absentId,
      dataHasilAbsensi: result,
      jumlah: result.length,
    });
  } catch (e) {
    res.status(500).render('errorPage', {
      errorMessage: 'Server gagal memenuhi permintaan untuk merender hasil absensi',
    });
  }
};

const renderAbsentInputPage = (req, res) => {
  const { absentId } = req.params;

  res.render('inputAbsensi', {
    absentId,
  });
};

const getAbsentHandler = async (req, res) => {
  const { mode } = req.query;

  try {
    if (mode) await renderAbsentResultPage(req, res);
    else await renderAbsentInputPage(req, res);
  } catch (e) {
    console.log(e);
    res.status(e.httpErrorStatus).render('errorPage', {
      errorMessage: e.message,
    });
  }
};

module.exports = { getAbsentHandler };
