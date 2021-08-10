const { load } = require('csv-load-sync')

const readDataCsv = (filePath) => {
  let result = []

  const csv = load(filePath)

  csv.forEach((chunks) => {
    let { nama1, npm1, nama2, npm2 } = chunks
    let dataObject = {}

    if(nama1){
      dataObject = {
        nama: nama1,
        npm: npm1
      }
      result.push(dataObject)
    }

    if(nama2) {
      dataObject = {
        nama: nama2,
        npm: npm2
      }
      result.push(dataObject)
    }
  })

  return result
}

module.exports = { readDataCsv }
