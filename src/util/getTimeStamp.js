const date = require('date-and-time')

const getTimeStamp = () => {
  const now = new Date()

  const timestamp = date.format(now, 'YYYY/MM/DD HH:mm:ss')
  return timestamp
}

module.exports = { getTimeStamp }
