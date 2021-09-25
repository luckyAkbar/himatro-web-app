const { testQuery } = require('../../db/connection');
const { QueryError } = require('../classes/QueryError');
const { readDataCsvForAbsent } = require('./readDataCsv');

const initNewAbsentRecord = async (referensiId, lingkup) => {
  const dataPengurusHimatro = readDataCsvForAbsent(`${__dirname}/../../db/data/fullData.csv`, lingkup);
  let fullQuery = '';

  try {
    dataPengurusHimatro.forEach(async (data) => {
      const query = `INSERT INTO absensi (referensi_id, npm, nama, divisi) VALUES (
          '${referensiId}',
          '${data.npm}',
          '${data.nama}',
          '${data.divisi}');
      `;
      fullQuery += query;
    });
    await testQuery(fullQuery);
  } catch (e) {
    console.log(e);
    throw new QueryError('failed to create new Absent');
  }
};

const createNewAbsent = async (referensiId, lingkup) => {
  try {
    await initNewAbsentRecord(referensiId, lingkup);
  } catch (e) {
    console.log(e);
    throw new QueryError('failed to create new absent');
  }
};

const createNewKegiatan = async (refId, {
  namaKegiatan,
  mulai,
  akhir,
}) => {
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
    console.log(e);
    throw new QueryError('Failed to create new kegiatan');
  }
};

module.exports = {
  createNewAbsent,
  createNewKegiatan,
};
