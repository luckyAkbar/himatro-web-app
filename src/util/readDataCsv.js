const { load } = require('csv-load-sync');

const translateLingkup = (lingkup) => {
  switch(lingkup) {
    case 'ph':
      return 'Pengurus Harian';
    case 'ppd':
      return 'Departemen Pendidikan dan Pengembangan Diri';
    case 'kpo':
      return 'Departemen Kaderisasi Dan Pengembangan Organisasi';
    case 'kominfo':
      return 'Departemen Komunikasi Dan Informasi';
    case 'soswir':
      return 'Departemen Sosial dan Kewirausahaan';
    case 'bangtek':
      return 'Departemen Pengembangan Keteknikan';
    case 'seluruhAnggota':
      return 'seluruhAnggota';
    default:
      return false;
    
  }
}

const readDataCsvForAbsent = (filePath, lingkup) => {
  const lingkupAbsen = translateLingkup(lingkup);
  const result = [];

  const csv = load(filePath);
  let dataObject = {};

  csv.forEach(({
    npm,
    nama,
    divisi,
    departemen,
  }) => {
    if (departemen === lingkupAbsen) {
      dataObject = {
        nama,
        npm,
        divisi,
      };
      result.push(dataObject);
    }

    if (lingkup === 'seluruhAnggota') {
      dataObject = {
        nama,
        npm,
        divisi,
      };
      result.push(dataObject);
    }
  });

  return result;
};

const readDataCsv = (filePath) => {
  const result = [];

  const csv = load(filePath);
  let dataObject = {};

  csv.forEach(({
    npm,
    nama,
    divisi,
    departemen,
  }) => {
    dataObject = {
      nama,
      npm,
      divisi,
    };
    result.push(dataObject);
  });

  return result;
};

/*
const allData = readDataCsv(__dirname+'/../../db/data/fullData.csv')
console.log(allData.length)

allData.forEach((data) => {
  if (String(data.npm).startsWith('19')) console.log(data.npm, data.nama)
})
*/

module.exports = {
  readDataCsv,
  readDataCsvForAbsent
};
