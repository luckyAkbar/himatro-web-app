const fs = require('fs');
const path = require('path');
const { testQuery } = require('../db/connection');

const baseSqlPath = path.join(__dirname, '../db/db.sql');

fs.readFile(baseSqlPath, { encoding: 'utf-8'}, async (err, data) => {
  if (err) {
    console.log('error', err);
    return;
  }

  try {
    console.log('start to migrate databse...');
    await testQuery(data);

    console.log('finished.')
  } catch (e) {
    console.log('error', e);
  }
});