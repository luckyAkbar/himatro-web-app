const getTimeStamp = () => {
  const now = new Date()

  const timestamp = new Date(`${now.getFullYear()}-${now.getMonth()}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`)
  
  return timestamp
}

module.exports = { getTimeStamp }
