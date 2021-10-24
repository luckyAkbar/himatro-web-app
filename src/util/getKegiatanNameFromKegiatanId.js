'use stict';

const { CustomError } = require('../classes/CustomError');
const { testQuery } = require('../../db/connection');
const { refIdValidator } = require('./validator');

const getKegiatanNameFromKegiatanId = async (req, res) => {
  const { absentId } = req.query;
  if (!refIdValidator(absentId)) throw new CustomError('Absent Id Invalid');

  const query = 'SELECT nama_kegiatan FROM kegiatan WHERE kegiatan_id = $1';
  const params = [absentId];

  try {
    const { rows } = await testQuery(query, params);
    return rows[0].nama_kegiatan;
  } catch (e) {
    return '-';
  }
};

module.exports = { getKegiatanNameFromKegiatanId };
