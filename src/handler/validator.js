const comparator = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
const timeFormatComparator = /[!@#$%^&*()_+\=\[\]{};'"\\|,<>\/?]+/
const keteranganComparator = /[h,i]/

const npmValidator = (npm) => {
  if (npm.length > 10) {
    return false
  }

  const test = parseInt(npm)

  if (isNaN(test)){
    return false
  }

  return true
}

const namaValidator = (nama) => {
  if (comparator.test(nama)){
    return false
  }

  if (nama.length > 255) {
    console.log('nama too long')
    return false
  }

  return true
}

const namaKegiatanValidator = (namaKegiatan) => {
  if (comparator.test(namaKegiatan)) {
    return false
  }

  if(namaKegiatan.length > 255) {
    return false
  }
  return true
}

const tanggalValidator = (tanggal) => {
  if (timeFormatComparator.test(tanggal)) {
    return false
  }

  const testDate = new Date(tanggal)

  if (testDate.toString() === 'Invalid Date') {
    return false
  }

  if (tanggal.length > 255) {
    return false
  }

  return true
}

const keteranganValidator = (keterangan) => {
  if (keterangan.length !== 1) {
    return false
  }

  if (comparator.test(keterangan)) {
    return false
  }

  if (keterangan.search(keteranganComparator) !== 0) {
    return false
  }

  return true
}

const refIdValidator = (refId) => {
  if (refId.length !== 10) {
    return false
  }

  if (comparator.test(refId)) {
    return false
  }

  return true
}

const validateAbsentRefData = (namaKegiatan, tanggalPelaksanaan, tanggalBerakhir) => {
  if (!namaKegiatanValidator(namaKegiatan)) {
    return false
  }

  if (!tanggalValidator(tanggalPelaksanaan)) {
    return false
  }

  if (!tanggalValidator(tanggalBerakhir)) {
    return false
  }

  return true
}

const postAbsentDataValidator = (refId, npm, nama, keterangan) => {
  if (!(npmValidator(npm) && namaValidator(nama) && keteranganValidator(keterangan) && refIdValidator(refId))) {
    return false
  }

  return true
}

module.exports = { npmValidator, namaValidator, namaKegiatanValidator, tanggalValidator, validateAbsentRefData, postAbsentDataValidator }
