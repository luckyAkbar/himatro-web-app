const getAbsentHandler = (req, res) => {
  const { absentId } = req.params
  console.log(absentId)

  res.sendStatus(200)
}

module.exports = { getAbsentHandler }
