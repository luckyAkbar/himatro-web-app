const readline = require('readline');
const { testQuery } = require('../db/connection');
const { createHash } = require('../src/util/cryptoHash');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const insertNewUser = async (email, password) => {
  try {
    const encrypted = await createHash(password.trim());
    const query = 'INSERT INTO users (email, password) VALUES ($1, $2)';
    const params = [email.trim(), encrypted];

    await testQuery(query, params);

    console.log('Success.');
  } catch (e) {
    console.log('failed: ', e);
    process.exit(1);
  }
};

const insertNewAnggotaBiasa = async (NPM, nama, email) => {
  const query = 'INSERT INTO anggota_biasa (npm, nama, email) VALUES ($1, $2, $3)';
  const params = [NPM.trim(), nama.trim(), email.trim()];

  try {
    await testQuery(query, params);
  } catch (e) {
    console.log('failed:', e);

    process.exit(1);
  }
};

const getSuperAdminJabatanID = async () => {
  const query = `SELECT jabatan_id FROM jabatan WHERE nama_jabatan = 'Super Admin'`;
  let jabatanID;
  try {
    const { rows } = await testQuery(query);

    jabatanID = rows[0].jabatan_id;
  } catch (e) {
    console.log('failed: ', e);

    process.exit(1);
  }

  return jabatanID;
}

const insertPengurusAsSuperAdmin = async (NPM, divisiID) => {
  try {
    const jabatanID = await getSuperAdminJabatanID();
    const query = 'INSERT INTO pengurus (npm, divisi_id, jabatan_id) VALUES ($1, $2, $3)';
    const params = [NPM.trim(), divisiID.trim(), jabatanID];

    await testQuery(query, params);
  } catch (e) {
    console.log('failed:', e);

    process.exit(1);
  }
};

rl.question('Masukan NPM: ', async (NPM) => {
  rl.question('Masukan Nama Lengkap: ', async (nama) => {
    rl.question('Masukan Divisi ID super admin: ', async (divisiID) => {
      rl.question('Masukan alamat email super user: ', async (email) => {
        rl.question('Masukan password super user: ', async (password) => {
          console.log('all input are received and trimmed.');

          await insertNewAnggotaBiasa(NPM, nama, email);
          await insertNewUser(email, password);
          await insertPengurusAsSuperAdmin(NPM, divisiID);
  
          process.exit(0);
        });
      });
    });
  });
});