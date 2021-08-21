const { testQuery } = require('../../db/connection')

const getNamaKegiatan = async (refId) => {
  const query = `SELECT nama_kegiatan FROM KEGIATAN
    WHERE kegiatan_id = $1`
  const params = [refId]

  try {
    const { rows } = await testQuery(query, params)
    const namaKegiatan = rows[0].nama_kegiatan
    return namaKegiatan
  } catch (e) {
    console.log(e)
    return './.'
  }
}

module.exports = { getNamaKegiatan }
