const { testQuery } = require('../../db/connection');
const { QueryError } = require('../classes/QueryError');

const getBasicProfile = async (email) => {
  const query = 'SELECT npm, nama, data_lengkap FROM anggota_biasa WHERE email = $1';
  const params = [email];

  try {
    const { rows } = await testQuery(query, params);
    return rows[0];
  } catch (e) {
    console.log(e);
    throw new QueryError(`Failed to get basic profile ${email}`);
  }
};

const getDivisi = async (email) => {
  const query = `SELECT nama_divisi, departemen_id FROM divisi WHERE
        divisi_id = (SELECT divisi_id FROM pengurus WHERE
            npm = (SELECT npm FROM anggota_biasa WHERE email = $1))`;
  const params = [email];

  try {
    const { rows } = await testQuery(query, params);
    return rows[0];
  } catch (e) {
    console.log(e);
    throw new QueryError(`Failed to get divisi ${email}`);
  }
};

const getDepartemenAndDivisi = async (email) => {
  const query = 'SELECT nama_departemen FROM departemen WHERE departemen_id = $1';

  try {
    const divisi = await getDivisi(email);
    const params = [divisi.departemen_id];

    const { rows } = await testQuery(query, params);

    const departemenAndDivisi = {
      namaDepartemen: rows[0].nama_departemen,
      namaDivisi: divisi.nama_divisi,
    };

    return departemenAndDivisi;
  } catch (e) {
    console.log(e);
    throw new QueryError(`Failed to get Departemen ${email}`);
  }
};

const getProfile = async (req, res) => {
  const { email } = req;

  try {
    const basicProfile = await getBasicProfile(email);
    const departemenAndDivisi = await getDepartemenAndDivisi(email);

    const data = {
      nama: basicProfile.nama,
      npm: basicProfile.npm,
      email,
      departemen: departemenAndDivisi.namaDepartemen,
      divisi: departemenAndDivisi.namaDivisi,
      profileImgUrl: '/images/noProfile.jpg',
      isProfileComplete: basicProfile.data_lengkap,
    };

    res.status(200).render('profile', {
      data,
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = { getProfile };
