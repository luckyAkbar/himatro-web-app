const comparator = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
const timeFormatComparator = /[!@#$%^&*()_+\=\[\]{};'"\\|,<>\/?]+/
const keteranganComparator = /[h,i]/
const namaComparator = /[!@#$%^&*()_+\-=\[\]{};:"\\|,<>\/?]+/
const sortByComparator = /[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]+/

const npmValidator = (npm) => {
  try {
    if (npm.length > 10) {
      return false
    }

    const test = parseInt(npm)

    if (isNaN(test)){
      return false
    }
  } catch (e) {
    return false
  }

  return true
}

const sortByValidator = (sortBy) => {
  try {
    if (sortByComparator.test(sortBy)) {
      return false
    }

    if (sortBy !== 'divisi' || sortBy !== 'keterangan' || sortBy !== 'waktu_pengisian') {
      return 'divisi'
    }
  } catch (e) {
    return false
  }

  return true
}

const showValueValidator = (show) => {
  try {
    if (comparator.test(show)) {
      return false
    }

    if (isNaN(show)) {
      return 'all'
    }
  } catch (e) {
    return false
  }

  return 'all'
}

const namaValidator = (nama) => {
  try {
    if (namaComparator.test(nama)){
      return false
    }

    if (nama.length > 255) {
      return false
    }
  } catch (e) {
    return false
  }

  return true
}

const namaKegiatanValidator = (namaKegiatan) => {
  try {
    if (comparator.test(namaKegiatan)) {
      return false
    }

    if(namaKegiatan.length > 255) {
      return false
    }
  } catch (e) {
    return false
  }
  return true
}

const tanggalValidator = (tanggal) => {
  try {
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
  } catch (e) {
    return false
  }

  return true
}

const keteranganValidator = (keterangan) => {
  try {
    if (keterangan.length !== 1) {
      return false
    }

    if (comparator.test(keterangan)) {
      return false
    }

    if (keterangan.search(keteranganComparator) !== 0) {
      return false
    }
  } catch (e) {
    return false
  }

  return true
}

const refIdValidator = (refId) => {
  try {
    if (refId.length !== 10) {
      return false
    }

    if (comparator.test(refId)) {
      return false
    }
  } catch (e) {
    return false
  }

  return true
}

const modeValidator = (mode) => {
  try {
    if (comparator.test(mode)) {
      return false
    }

    if (!(mode === 'view' || mode === 'input' || mode === 'post' || mode === 'create')) {
      return false
    }
  } catch (e) {
    return false
  }

  return true
}

const validateAbsentRefData = (namaKegiatan, tanggalPelaksanaan, tanggalBerakhir) => {
  try {
    if (!namaKegiatanValidator(namaKegiatan)) {
      return false
    }

    if (!tanggalValidator(tanggalPelaksanaan)) {
      return false
    }

    if (!tanggalValidator(tanggalBerakhir)) {
      return false
    }
  } catch (e) {
    return false
  }

  return true
}

const postAbsentDataValidator = (refId, npm, nama, keterangan) => {
  try {
    if (!(npmValidator(npm) && namaValidator(nama) && keteranganValidator(keterangan) && refIdValidator(refId))) {
      return false
    }
  } catch {
    return false
  }

  return true
}

module.exports = { npmValidator,
   namaValidator,
   namaKegiatanValidator,
   tanggalValidator,
   validateAbsentRefData,
   refIdValidator,
   modeValidator,
   sortByValidator,
   showValueValidator,
   postAbsentDataValidator, }
