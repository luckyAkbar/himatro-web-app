const { load } = require('csv-load-sync');

const result = [];

const csv = load(`${__dirname}/test.csv`);

csv.forEach((chunks) => {
  const {
    nama1, npm1, nama2, npm2,
  } = chunks;
  let dataObject = {};

  if (nama1) {
    dataObject = {
      nama: nama1,
      npm: npm1,
    };
    result.push(dataObject);
  }

  if (nama2) {
    dataObject = {
      nama: nama2,
      npm: npm2,
    };
    result.push(dataObject);
  }
});

console.log(result);
/*
const test = async () => {
  try {
    await createNewAbsent('jhhe')
  } catch (e) {
    console.log(e)
  }
}
*/
// module.exports = { result }
