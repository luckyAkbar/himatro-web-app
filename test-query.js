const { query } = require('./db/koneksi');

query('select now()', [], (err, res) => {
  console.log(res);
  console.log('selesai');
})
