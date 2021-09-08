const router = require('express').Router()
const { getAbsentHandler } = require('../handler/getAbsentHandler')
const { postAbsentHandler } = require('../handler/postAbsentHandler')
const { uploadAbsentSdmHandler } = require('../handler/postUploadAbsentSdmHandler')
const { kaderisasiSdmHandler } = require('../handler/postKaderisasiSdmHandler')
const { getAbsentSdm } = require('../handler/getAbsentSdm')
const { imageViewHandler } = require('../handler/imageViewHandler')
const { getBuktiAbsensiSdmHandler } = require('../handler/getBuktiAbsensiSdmHandler')
const { authentication } = require('../middleware/authentication')
const { getOnetimeSignupHandler } = require('../handler/getOnetimeSignupHandler')
const { logoutHandler } = require('../handler/logoutHandler')

const {
  getProfile,
  updateProfile
} = require('../handler/profileHandler')

const {
  postOnetimeSignupHandler,
  initOnetimeSignupHandler
} = require('../handler/postOnetimeSignupHandler')

const {
  loginLimiter,
  uploadLimiter
} = require('../middleware/rateLimiter')

const {
  getLoginPage,
  postLoginHandler,
} = require('../handler/loginHandler')

router.get('/', (req, res) => {
  res.render('homePage')
}).all('/', (req, res) => {
  res.status(400).render('errorPage', {
    errorMessage: 'maaf, halaman yang anda cari tidak ditemukan, atau metode tidak didukung:)'
  })
})

router.get('/tentang', (req, res) => {
  res.status(404).render('errorPage', {
    errorMessage: 'Halaman sedang dalam proses pengembangan'
  })
})

router.get('/absensi', getAbsentHandler)
  .post('/absensi', postAbsentHandler)

router.get('/tahap-pengembangan', (req, res) => {
  res.status(404).render('errorPage', {
    errorMessage: 'Halaman sedang dalam proses pengembangan'
  })
})

router.get('/kontak', (req, res) => {
  res.status(404).render('errorPage', {
    errorMessage: 'Halaman sedang dalam proses pengembangan'
  })
})

router.get('/login', getLoginPage)
  .post('/login', loginLimiter, postLoginHandler)

router.get('/logout', logoutHandler)

router.all('/profile', authentication)
  .get('/profile', getProfile)
  .put('/profile', updateProfile)

router.post('/kaderisasi/sdm', kaderisasiSdmHandler)

router.get('/kaderisasi/sdm/absensi', getAbsentSdm)
  .post('/kaderisasi/sdm/absensi', uploadAbsentSdmHandler)

router.get('/kaderisasi/sdm/absensi/bukti', getBuktiAbsensiSdmHandler)

router.get('/images/view/:imageId', imageViewHandler)

router.get('/protected/route', authentication)

router.get('/one-time-signup', getOnetimeSignupHandler)
  .post('/one-time-signup', uploadLimiter, postOnetimeSignupHandler)

router.post('/init/one-time-signup', initOnetimeSignupHandler)

router.put('init-db', async (req, res) => {
  try {
    await testQuery(`DROP TABLE IF EXISTS mahasiswa_baru;
    DROP TABLE IF EXISTS inventaris;
    DROP TABLE IF EXISTS kegiatan;
    DROP TABLE IF EXISTS parameter_keberhasilan;
    DROP TABLE IF EXISTS program_kerja;
    DROP TABLE IF EXISTS absensi;
    DROP TABLE IF EXISTS anggota_biasa;
    DROP TABLE IF EXISTS notulensi;
    DROP TABLE IF EXISTS rapat;
    DROP TABLE IF EXISTS anggota_kehormatan;
    DROP TABLE IF EXISTS anggota_luar_biasa;
    DROP TABLE IF EXISTS penganggung_jawab;
    DROP TABLE IF EXISTS pengurus;
    DROP TABLE IF EXISTS jabatan;
    DROP TABLE IF EXISTS divisi;
    DROP TABLE IF EXISTS departemen;
    DROP TABLE IF EXISTS kehadiran_sdm;
    DROP TABLE IF EXISTS sdm_kaderisasi;
    DROP TABLE IF EXISTS gambar;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS sessions;
    DROP TABLE IF EXISTS signupdata;
    
    CREATE TABLE departemen (
      departemen_id VARCHAR(10) PRIMARY KEY,
      nama_departemen VARCHAR(150) NOT NULL,
      jumlah_anggota INT DEFAULT NULL,
      CHECK (jumlah_anggota >= 0)
    );
    
    CREATE TABLE divisi (
      divisi_id VARCHAR(10) PRIMARY KEY,
      nama_divisi VARCHAR(150) NOT NULL,
      jumlah_anggota INT DEFAULT NULL,
      departemen_id VARCHAR(10) REFERENCES departemen(departemen_id) NOT NULL
      CHECK(jumlah_anggota >= 0)
    );
    
    CREATE TABLE program_kerja (
      progja_id VARCHAR(10) PRIMARY KEY,
      nama_progja VARCHAR(255) NOT NULL,
      deskripsi VARCHAR(255) NOT NULL,
      presentase_pelaksanaan INT DEFAULT 0 CHECK (presentase_pelaksanaan >= 0),
      divisi_id VARCHAR(10) REFERENCES divisi(divisi_id),
      matrix BOOLEAN DEFAULT 't' NOT NULL
    );
    
    CREATE TABLE parameter_keberhasilan (
      parameter_id VARCHAR(10) PRIMARY KEY,
      progja_id VARCHAR(10) REFERENCES program_kerja(progja_id) NOT NULL,
      deskripsi VARCHAR(255) NOT NULL,
      tercapai BOOLEAN NOT NULL DEFAULT 'f',
      tanggal_tercapai DATE DEFAULT NULL
    );
    
    CREATE TABLE kegiatan (
      kegiatan_id VARCHAR(10) PRIMARY KEY,
      nama_kegiatan VARCHAR(255) NOT NULL,
      tanggal_pelaksanaan TIMESTAMPTZ NOT NULL,
      --progja_id VARCHAR(10) REFERENCES program_kerja(progja_id),
      tanggal_berakhir TIMESTAMPTZ NOT NULL -- cari cara implement default dijadiin jam 23.59
    );
    
    CREATE TABLE jabatan (
      jabatan_id CHAR(10) PRIMARY KEY,
      nama_jabatan VARCHAR(255) UNIQUE NOT NULL,
      hak INT NOT NULL
    );
    
    CREATE TABLE pengurus (
      npm VARCHAR(11) PRIMARY KEY,
      divisi_id VARCHAR(10) REFERENCES divisi(divisi_id),
      jabatan_id CHAR(10) REFERENCES jabatan(jabatan_id)
    );
    
    CREATE TABLE anggota_biasa (
      npm VARCHAR(11) PRIMARY KEY,
      nama VARCHAR(255) NOT NULL,
      no_telpon VARCHAR(25) UNIQUE DEFAULT NULL,
      email VARCHAR(255) UNIQUE DEFAULT NULL,
      no_whatsapp VARCHAR(25) UNIQUE DEFAULT NULL,
      media_sosial VARCHAR(255) DEFAULT NULL,
      angkatan INT DEFAULT NULL,
      program_studi CHAR(1) DEFAULT NULL,
      ipk NUMERIC(3,2) DEFAULT NULL CHECK (ipk >= 0),
      alamat VARCHAR(255) DEFAULT NULL,
      pekerjaan VARCHAR(255) DEFAULT NULL,
      info_lainnya TEXT DEFAULT NULL
    );
    
    CREATE TABLE inventaris (
      inventaris_id VARCHAR(10) PRIMARY KEY,
      nama_inventaris VARCHAR(255) NOT NULL,
      jumlah INT NOT NULL CHECK (jumlah >= 0),
      kondisi CHAR(1) NOT NULL,
      deskripsi VARCHAR(255) DEFAULT NULL,
      peminjam VARCHAR(255) DEFAULT NULL,
      lokasi_keberadaan VARCHAR(255) NOT NULL,
      kepemilikan CHAR(1) NOT NULL,
      tahun_perolehan INT NOT NULL
      --foto???
    );
    
    CREATE TABLE absensi (
      referensi_id VARCHAR(10),
      npm VARCHAR(11) NOT NULL,
      nama VARCHAR(255) NOT NULL, -- Default ambil dari query npm ke anggota biasa, ambil namanya
      waktu_pengisian TIMESTAMPTZ DEFAULT NULL,
      keterangan CHAR(1) DEFAULT NULL,
      divisi VARCHAR(70) NOT NULL
    );
    
    CREATE TABLE mahasiswa_baru (
      npm VARCHAR(11) PRIMARY KEY,
      nama VARCHAR(255) NOT NULL,
      asal_sekolah VARCHAR(255) NOT NULL,
      program_studi CHAR(1) NOT NULL,
      no_telp VARCHAR(25) UNIQUE NOT NULL,
      alamat_email VARCHAR(255) UNIQUE NOT NULL,
      no_whatsapp VARCHAR(25) UNIQUE NOT NULL,
      media_sosial VARCHAR(255) NOT NULL,
      alamat VARCHAR(255) NOT NULL
    );
    
    CREATE TABLE notulensi (
      notulensi_id VARCHAR(10) PRIMARY KEY,
      referensi_id VARCHAR(10) NOT NULL,
      isi_notulensi TEXT NOT NULL,
      tanggal_pengisian TIMESTAMPTZ NOT NULL
    );
    
    CREATE TABLE rapat (
      rapat_id VARCHAR(10) PRIMARY KEY,
      jenis_rapat CHAR(1) NOT NULL,
      tanggal_pelaksanaan TIMESTAMPTZ NOT NULL,
      perihal_rapat VARCHAR(255) NOT NULL,
      tanggal_berakhir TIMESTAMPTZ NOT NULL --cari juga cara implemen default 3 jam setelahnya
    );
    
    CREATE TABLE anggota_luar_biasa (
      nama VARCHAR(255) NOT NULL,
      tahun_lulus INT NOT NULL,
      angkatan INT NOT NULL,
      nomor_sk VARCHAR(100) NOT NULL,
      npm VARCHAR(11) NOT NULL,
      tanggal_pengangkatan DATE NOT NULL
    );
    
    CREATE TABLE anggota_kehormatan (
      nama VARCHAR(255) NOT NULL,
      deskripsi_jasa VARCHAR(255) NOT NULL,
      nomor_sk VARCHAR(100) NOT NULL,
      tahun_lulus INT NOT NULL,
      angkatan INT NOT NULL,
      tanggal_pengangkatan DATE NOT NULL
    );
    
    CREATE TABLE penganggung_jawab (
      npm VARCHAR(11) REFERENCES pengurus(npm) NOT NULL,
      referensi_id VARCHAR(10) NOT NULL
    );
    
    CREATE TABLE sdm_kaderisasi (
      sdm_id VARCHAR(10) PRIMARY KEY,
      judul_kegiatan VARCHAR(255) NOT NULL,
      catatan VARCHAR(255) NOT NULL,
      presensi VARCHAR(10) UNIQUE NOT NULL
    );
    
    CREATE TABLE kehadiran_sdm (
      presensi VARCHAR(10) NOT NULL,
      nama VARCHAR(255) NOT NULL,
      npm VARCHAR(11) NOT NULL,
      kelas VARCHAR(4) NOT NULL,
      gambar_id VARCHAR(10) DEFAULT NULL,
      resume TEXT DEFAULT NULL
    );
    
    CREATE TABLE gambar (
      gambar_id VARCHAR(10) PRIMARY KEY,
      nama_gambar VARCHAR(50) NOT NULL
    );
    
    CREATE TABLE users (
      email VARCHAR(255) PRIMARY KEY,
      password VARCHAR(255) NOT NULL
    );
    
    CREATE TABLE sessions (
      sessionid VARCHAR(10) PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      session VARCHAR(200) UNIQUE NOT NULL,
      useragent VARCHAR(200) NOT NULL,
      expired BIGINT NOT NULL
    );
    
    CREATE TABLE signupdata (
      key VARCHAR(15) NOT NULL,
      nama VARCHAR(255) NOT NULL,
      npm VARCHAR(11) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL
    );
    
    INSERT INTO departemen (departemen_id, nama_departemen) VALUES ('dep0000001', 'Pengurus Harian');
    INSERT INTO departemen (departemen_id, nama_departemen) VALUES ('dep0000002', 'Pendidikan dan Pengembangan Diri');
    INSERT INTO departemen (departemen_id, nama_departemen) VALUES ('dep0000003', 'Kaderisasi dan Pengembangan Organisasi');
    INSERT INTO departemen (departemen_id, nama_departemen) VALUES ('dep0000004', 'Sosial dan Kewirausahaan');
    INSERT INTO departemen (departemen_id, nama_departemen) VALUES ('dep0000005', 'Pengembangan Keteknikan');
    INSERT INTO departemen (departemen_id, nama_departemen) VALUES ('dep0000006', 'Komunikasi dan Informasi');
    
    INSERT INTO divisi (divisi_id, nama_divisi, departemen_id ) VALUES ('div0000001', 'Pengurus Harian', 'dep0000001');
    INSERT INTO divisi (divisi_id, nama_divisi, departemen_id) VALUES ('div0000002', 'Kaderisasi dan Pengembangan Organisasi', 'dep0000003');
    INSERT INTO divisi (divisi_id, nama_divisi, departemen_id) VALUES ('div0000003', 'Pendidikan', 'dep0000002');
    INSERT INTO divisi (divisi_id, nama_divisi, departemen_id) VALUES ('div0000004', 'Kerohanian', 'dep0000002');
    INSERT INTO divisi (divisi_id, nama_divisi, departemen_id) VALUES ('div0000005', 'Minat dan Bakat', 'dep0000002');
    INSERT INTO divisi (divisi_id, nama_divisi, departemen_id) VALUES ('div0000006', 'Sosial', 'dep0000004');
    INSERT INTO divisi (divisi_id, nama_divisi, departemen_id) VALUES ('div0000007', 'Kewirausahaan', 'dep0000004');
    INSERT INTO divisi (divisi_id, nama_divisi, departemen_id) VALUES ('div0000008', 'Penelitian dan Pengembangan', 'dep0000005');
    INSERT INTO divisi (divisi_id, nama_divisi, departemen_id) VALUES ('div0000009', 'Pengabdian Masyarakat', 'dep0000005');
    INSERT INTO divisi (divisi_id, nama_divisi, departemen_id) VALUES ('div0000010', 'Media Informasi', 'dep0000006');
    INSERT INTO divisi (divisi_id, nama_divisi, departemen_id) VALUES ('div0000011', 'Hubungan Masyarakat', 'dep0000006');
    
    INSERT INTO jabatan (jabatan_id, nama_jabatan, hak) VALUES ('jab0000001', 'Ketua Umum', 9);
    INSERT INTO jabatan (jabatan_id, nama_jabatan, hak) VALUES ('jab0000002', 'Wakil Ketua', 0);
    INSERT INTO jabatan (jabatan_id, nama_jabatan, hak) VALUES ('jab0000003', 'Sekertaris Umum', 0);
    INSERT INTO jabatan (jabatan_id, nama_jabatan, hak) VALUES ('jab0000004', 'Wakil Sekertaris Umum', 0);
    INSERT INTO jabatan (jabatan_id, nama_jabatan, hak) VALUES ('jab0000005', 'Bendahara', 0);
    INSERT INTO jabatan (jabatan_id, nama_jabatan, hak) VALUES ('jab0000006', 'Wakil Bendahara', 0);
    INSERT INTO jabatan (jabatan_id, nama_jabatan, hak) VALUES ('jab0000007', 'Kepala Departemen', 0);
    INSERT INTO jabatan (jabatan_id, nama_jabatan, hak) VALUES ('jab0000008', 'Sekertaris Departemen', 0);
    INSERT INTO jabatan (jabatan_id, nama_jabatan, hak) VALUES ('jab0000009', 'Kepala Divisi', 0);
    INSERT INTO jabatan (jabatan_id, nama_jabatan, hak) VALUES ('jab0000010', 'Anggota', 0);
    
    /*
    INSERT INTO anggota_biasa (npm, nama, email, angkatan) VALUES ('1915061056', 'Lucky', 'm248r4231@dicoding.org', '2019');
    
    INSERT INTO pengurus (npm, divisi_id, jabatan_id) VALUES ('1915061056', 'div0000001', 'jab0000001');
    
    SELECT hak FROM jabatan WHERE jabatan_id = (SELECT jabatan_id FROM pengurus WHERE npm = (SELECT npm FROM anggota_biasa WHERE email = 'm248r4231@dicoding.org'));
    */`)
    res.sendStatus(201)
    return
  } catch (e) {
    res.sendStatus(500)
  }
})

router.all('*', (req, res) => {
  res.status(404).render('errorPage', {
    errorMessage: 'maaf, halaman yang anda cari tidak ditemukan, atau metode tidak didukung:)'
  })
})

module.exports = { router }
