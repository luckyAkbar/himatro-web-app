const getAbsentHandler = (req, res) => {
  console.log('hit absen')
  res.render('absent')
}

module.exports = { getAbsentHandler }
