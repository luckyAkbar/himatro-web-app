const { QueryError } = require('../classes/QueryError')
const { testQuery } = require('../../db/connection')

const getUserPermissionLevel = async (email) => {
    const query = `SELECT hak FROM jabatan WHERE jabatan_id = (
        SELECT jabatan_id FROM pengurus WHERE npm = (
            SELECT npm FROM anggota_biasa WHERE email = $1
            )
        )`
    const params = [email]

    try {
        const { rows } = await testQuery(query, params)

        if (rows[0] == undefined) return 0

        return Number(rows[0].hak)
    } catch (e) {
        if (e instanceof QueryError) {
            throw new QueryError('Failed to get user permission level')
        }
        
        console.log(e)
        return 0
    }
}

module.exports = { getUserPermissionLevel }