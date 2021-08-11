const { testQuery } = require('../../db/connection')
const { checkRefIdExists } = require('../util/absentFiller')
const { refIdValidator, showValueValidator } = require('../util/validator')

const getAbsentHandler = async (req, res) => {
  const { absentId } = req.params
  let { show } = req.query

  const isAbsentIdValid = refIdValidator(absentId)
  const isShowValid = showValueValidator(show)

  if(!(isAbsentIdValid && isShowValid)) {
    res.status(400).json({ error: 'Absent id or show value invalid' })
    return
  }

  try {
    const isAbsentFormExists = await checkRefIdExists(absentId, 'absensi', 'referensi_id')

    if (!isAbsentFormExists) {
      res.status(400).json({ error: 'Absent form doesn\'t exist or already closed!' })
      return
    }

    const absentFormResult = await getAbsentFormResult(absentId, show, res)
  } catch (e) {
    console.log(e)
  }
}

const getAbsentFormResult = async (absentId, show, res) => {
  let query = `SELECT * FROM absensi WHERE referensi_id = $1 ORDER BY npm`
  let params = [absentId]

  if (show !== 'all' && show >= 0 && show !== '') {
    query += ` LIMIT $2`
    params.push(show)
  }

  try {
    const { rows } = await testQuery(query, params)
    res.status(200).send(rows)
  } catch (e) {
    res.sendStatus(500)
  }
}

module.exports = { getAbsentHandler }
