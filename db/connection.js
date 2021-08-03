require('dotenv').config()
//console.log(typeof(process.env.MAX_CONNECTION))
const { Pool } = require('pg')

const config = {
  connectionTimeoutMillis: parseInt(process.env.CONNECTION_TIMEOUT_MILLISEC),
  idleTimeoutMillis: parseInt(process.env.IDLE_TIMEOUT_MILLISEC),
  max: parseInt(process.env.MAX_CONNECTION),
}

const pool = new Pool(config)

pool.on('error', (err, client) => {
  console.log('Unexpected error from client [/db/koneksi.js]')
  process.exit(-1)
});

pool.on('connect', () => {
  console.log('Connected to the Database [/db/koneksi.js]')
})

module.exports = {
  query: (text, params) => pool.query(text, params),
}
