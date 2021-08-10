const getAbsentHandler = (req, res) => {
  if(req.query.mode === 'read') {
    res.send('silahkan isi post body request')
  }
}

module.exports = { getAbsentHandler }
