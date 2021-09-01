require('dotenv').config()

const chalk = require('chalk')
const { Pool } = require('pg')

const config = {
  connectionTimeoutMillis: parseInt(process.env.CONNECTION_TIMEOUT_MILLISEC),
  idleTimeoutMillis: parseInt(process.env.IDLE_TIMEOUT_MILLISEC),
  max: parseInt(process.env.MAX_CONNECTION),
}
/*
const pool = new Pool(config)
pool.on('error', (err, client) => {
  console.log('Unexpected error from client [/db/koneksi.js]')
  process.exit(-1)
});
pool.on('connect', () => {
  console.log('Connected to the Database [/db/koneksi.js]')
})
*/
const newPool = new Pool(config)

newPool.on('error', (err, client) => {
  console.log('Unexpected error from client [/db/koneksi.js]')
  //process.exit(-1)
});

newPool.on('ECONNREFUSED', () => {
  console.log('Connection refused')
})


async function testQuery(query, params) {
  try {
    const start = Date.now()
    const client = await newPool.connect()
    const res = await client.query(query, params)

    client.release(true)

    const duration = Date.now() - start
    console.log(chalk.yellow('executed query', query, 'returned', res.rowCount, 'in', duration, 'ms'));

    return res
  } catch(e) {
    console.log(chalk.red(`err connection.js ${params}`, e))
  }
}

module.exports = {
  //query: (text, params) => pool.query(text, params),
  testQuery
}
