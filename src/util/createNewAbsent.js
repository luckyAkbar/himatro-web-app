const { testQuery } = require('../../db/connection');
const { CustomError } = require('../classes/CustomError');
const { readDataCsvForAbsent } = require('./readDataCsv');

const generateNewAbsentRecordQueryString = (referensiId, lingkup) => {
  const dataPengurusHimatro = readDataCsvForAbsent(`${__dirname}/../../db/data/fullData.csv`, lingkup);
  let fullQuery = '';

  dataPengurusHimatro.forEach(async (data) => {
    const query = `INSERT INTO absensi (referensi_id, npm, nama, divisi) VALUES (
        '${referensiId}',
        '${data.npm}',
        '${data.nama}',
        '${data.divisi}');
    `;
    fullQuery += query;
  });

  return fullQuery;
};

const createNewAbsent = async (referensiId, lingkup) => {
  const query = generateNewAbsentRecordQueryString(referensiId, lingkup);
  try {
    await testQuery(query);
  } catch (e) {
    throw new CustomError('Server gagal melakukan inisiasi absent form baru.', 500);
  }
};

const createNewKegiatan = async (refId, { namaKegiatan, mulai, akhir }) => {
  const query = `INSERT INTO kegiatan (
    kegiatan_id,
    nama_kegiatan,
    tanggal_pelaksanaan,
    tanggal_berakhir
  ) VALUES ($1, $2, $3, $4)`;

  const params = [
    refId,
    namaKegiatan,
    mulai,
    akhir,
  ];

  try {
    await testQuery(query, params);
  } catch (e) {
    throw new CustomError('Server gagal dalam mendaftarkan kegiatan baru.', 500);
  }
};

module.exports = {
  createNewAbsent,
  createNewKegiatan,
};
