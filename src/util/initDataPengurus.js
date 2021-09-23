const { testQuery } = require('../../db/connection');
const { readDataCsv } = require('./readDataCsv');

const convertDivisiToDivisiId = (divisi) => {
  switch (divisi) {
    case 'Pengurus Harian':
      return 'div0000001';

    case 'Minat dan Bakat':
      return 'div0000005';

    case 'Kerohanian':
      return 'div0000004';

    case 'KPO':
      return 'div0000002';

    case 'Media Informasi':
      return 'div0000010';

    case 'Hubungan Masyarakat':
      return 'div0000011';

    case 'Sosial':
      return 'div0000006';

    case 'Kewirausahaan':
      return 'div0000007';

    case 'Penelitian dan Pengembangan':
      return 'div0000008';

    case 'Pengabdian Masyarakat':
      return 'div0000009';

    case 'Pendidikan':
      return 'div0000003';

    case 'Super Admin':
      return 'jab1603123';

    default:
      return 'div0000010';
  }
};

const getDivisiFromBaseData = (npm) => { // diambil dari fullData.csv atau data mentah
  const baseData = readDataCsv(`${__dirname}/../../db/data/fullData.csv`);

  for (let i = 0; i < baseData.length; i += 1) {
    if (npm === baseData[i].npm) {
      return baseData[i].divisi;
    }
  }

  return false;
};

const checkIsOrganizationLeader = (npm) => {
  const pengecualian = [ // ini berisi daftar non anggota (pimpinan)
    1915031069,
    1915031039,
    1915031021,
    1955061010,
    1955061004,
    2015061015,
    1915061053,
    2015031039,
    1915031044,
    1915031079,
    1915061019,
    1915031043,
    2015031082,
    1915061040,
    2015061001,
    1955031012,
    1955031014,
    1915031006,
    2015031035,
    1955031003,
    1915031059,
    1915031072,
    2015031002,
    1915031070,
    1915031056,
  ];

  for (let i = 0; i < pengecualian.length; i += 1) {
    if (npm === String(pengecualian[i])) {
      return true;
    }
  }

  return false;
};

const initOrganizationLeaderData = async (npm) => {
  const leadersNPM = [ // this data must be updated annually / on every new periods
    [1915031069, 'jab0000001'], // kahim
    [1915031039, 'jab0000002'], // wakahim
    [1915031021, 'jab0000003'], // sekum
    [1955061010, 'jab0000004'], // wasekum
    [1955061004, 'jab0000005'], // bendahara
    [2015061015, 'jab0000006'], // wakil bendahara
    [1915061053, 'jab0000007'], // (kadep) ppd
    [2015031039, 'jab0000008'], // (sekdep) ppd
    [1915031044, 'jab0000009'], // kadiv  // untuk data kadiv, terserah urutannya. yg penting
    [1915031079, 'jab0000009'], // kadiv  // kalo bisa sesuain urutan di bawah sekdep dan kadepnya
    [1915061019, 'jab0000009'], // kadiv
    [1915031043, 'jab0000007'], // kadep kader
    [2015031082, 'jab0000008'], // sekdep kader
    [1915061040, 'jab0000007'], // kadep kominfo
    [2015061001, 'jab0000008'], // sekdep kominfo
    [1955031012, 'jab0000009'], // kadiv
    [1955031014, 'jab0000009'], // kadiv
    [1915031006, 'jab0000007'], // kadep soswir
    [2015031035, 'jab0000008'], // sekdep soswir
    [1955031003, 'jab0000009'], // kadiv
    [1915031059, 'jab0000009'], // kadiv
    [1915031072, 'jab0000007'], // kadep bangtek
    [2015031002, 'jab0000008'], // sekdep bangtek
    [1915031070, 'jab0000009'], // kadiv
    [1915031056, 'jab0000009'], // kadiv
  ];

  const query = 'INSERT INTO pengurus (npm, divisi_id, jabatan_id) VALUES ($1, $2, $3)';
  let params = [];
  let divisiId;

  leadersNPM.forEach(async (data) => {
    if (npm === data[0]) {
      divisiId = convertDivisiToDivisiId(getDivisiFromBaseData(data[0]));
      console.log(divisiId, getDivisiFromBaseData(npm));
      params = [
        data[0],
        divisiId,
        data[1],
      ];

      try {
        await testQuery(query, params);
        return;
      } catch (e) {
        console.log(`failed to insert leaders data ${npm}`, e);
      }
    }
  });
};

const initDataPengurus = async (npm) => {
  const isOrganizationLeader = checkIsOrganizationLeader(npm);
  console.log(isOrganizationLeader)

  if (isOrganizationLeader) {
    initOrganizationLeaderData(npm);
    return;
  }

  const jabatanId = 'jab0000010';
  const query = 'INSERT INTO pengurus (npm, divisi_id, jabatan_id) VALUES ($1, $2, $3)';
  const divisi = getDivisiFromBaseData(npm);
  const params = [
    npm,
    convertDivisiToDivisiId(divisi),
    jabatanId,
  ];

  try {
    await testQuery(query, params);
  } catch (e) {
    console.log(`Failed to insert data pengurus ${npm}`, e);
  }
};

module.exports = { initDataPengurus };
