const { load } = require('csv-load-sync');

const readDataCsv = (filePath) => {
  const result = [];

  const csv = load(filePath);
  let dataObject = {};

  csv.forEach(({
    npm,
    nama,
    divisi,
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

allData.forEach((data) => {
  if (String(data.npm).startsWith('19')) console.log(data.npm, data.nama)
})
*/

module.exports = { readDataCsv };
