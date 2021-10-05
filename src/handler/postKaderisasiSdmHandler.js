const { load } = require('csv-load-sync');
const chalk = require('chalk');
const { namaFormatter } = require('../util/formatter');
const { sdmUIDGenerator } = require('../util/generator');
const { testQuery } = require('../../db/connection');
const { namaKegiatanValidator } = require('../util/validator');
const { createNewKegiatan } = require('../util/createNewAbsent');

const initNewAbsentRecord = async (opt, data) => {
  if (opt === 'sdm') {
    const {
      refId,
      tableName,
      recordName,
    } = data;

    const maba = load(`${__dirname}/../../db/data/maba2021.csv`);

    try {
      maba.forEach(async (dataMaba) => {
        const query = `INSERT INTO ${tableName} (
          ${recordName[0]},
          ${recordName[1]},
          ${recordName[2]},
          ${recordName[3]})
        VALUES ($1, $2, $3, $4)`;

        const params = [
          refId,
          namaFormatter(dataMaba.nama),
          dataMaba.npm,
          dataMaba.kelas,
        ];

        await testQuery(query, params);
      });
    } catch (e) {
      console.log(chalk.red(e));
    }
  }
};

const kaderisasiSdmHandler = async (req, res) => {
  const { namaKegiatan, catatan } = req.body;

  if (!namaKegiatanValidator(namaKegiatan)) {
    res.sendStatus(400);
    return;
  }

  const sdmId = sdmUIDGenerator();
  const presensi = sdmUIDGenerator();

  const query = `INSERT INTO sdm_kaderisasi (
    sdm_id,
    judul_kegiatan,
    catatan,
    presensi
  ) VALUES ($1, $2, $3, $4)`;
  const params = [
    sdmId, // sdm_id
    namaKegiatan,
    catatan,
    presensi, // presensi
  ];

  try {
    await testQuery(query, params);

    const data = {
      refId: presensi,
      tableName: 'kehadiran_sdm',
      recordName: [
        'presensi',
        'nama',
        'npm',
        'kelas',
      ],
    };

    await initNewAbsentRecord('sdm', data);
    await createNewKegiatan(presensi, req.body);

    res.status(201).json({
      message: 'Kegiatan telah tercatat, dan absensi telah terbentuk.',
      absensiId: presensi,
    });
  } catch (e) {
    console.log(chalk.red(e));
    res.status(500).json({ error: 'Server error, please contact admin to resolve' });
  }
};

module.exports = { kaderisasiSdmHandler };
