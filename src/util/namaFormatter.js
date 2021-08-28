const namaFormatter = (nama) => {
  nama = nama.toLowerCase()
  nama = nama.split(' ')

  for (let i = 0; i < nama.length; i++) {
    nama[i] = nama[i][0].toUpperCase() + nama[i].substr(1);
  }

  nama = nama.join(" ")
  return nama
}

module.exports = { namaFormatter }
