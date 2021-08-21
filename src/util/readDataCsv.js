const { load } = require('csv-load-sync')

const readDataCsv = (filePath) => {
  let result = []

  const csv = load(filePath)
  let dataObject = {}

  csv.forEach(({
     npm,
     nama,
     divisi
  }) => {

    dataObject = {
      nama,
      npm,
      divisi
    }

    result.push(dataObject)
  })

  return result
}

module.exports = { readDataCsv }
