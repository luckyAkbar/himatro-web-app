DROP TABLE IF EXISTS mahasiswa_baru;
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

CREATE TABLE departemen (
  departemen_id VARCHAR(10) PRIMARY KEY,
  jumlah_anggota INT NOT NULL,
  CHECK (jumlah_anggota >= 0)
);

CREATE TABLE divisi (
  divisi_id VARCHAR(10) PRIMARY KEY,
  jumlah_anggota INT NOT NULL,
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
  jabatan_id CHAR(1) PRIMARY KEY,
  nama_jabatan VARCHAR(255) UNIQUE NOT NULL,
  singkatan VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE pengurus (
  npm VARCHAR(11) PRIMARY KEY,
  divisi_id VARCHAR(10) REFERENCES divisi(divisi_id),
  jabatan_id CHAR(1) REFERENCES jabatan(jabatan_id)
);

CREATE TABLE anggota_biasa (
  npm VARCHAR(11) PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  no_telpon VARCHAR(25) UNIQUE NOT NULL,
  alamat_email VARCHAR(255) UNIQUE NOT NULL,
  no_whatsapp VARCHAR(25) UNIQUE NOT NULL,
  media_sosial VARCHAR(255),
  angkatan INT NOT NULL,
  program_studi CHAR(1) NOT NULL,
  ipk NUMERIC(3,2) DEFAULT 0.00 CHECK (ipk >= 0),
  alamat VARCHAR(255) NOT NULL
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
  gambar_id VARCHAR(10) DEFAULT NULL,
  resume TEXT DEFAULT NULL
);

CREATE TABLE gambar (
  gambar_id VARCHAR(10) PRIMARY KEY,
  nama_gambar VARCHAR(35) NOT NULL
);

CREATE TABLE users (
  email VARCHAR(255) PRIMARY KEY,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE sessions (
  sessionid VARCHAR(10) PRIMARY KEY,
  session VARCHAR(200) UNIQUE NOT NULL,
  useragent VARCHAR(200) NOT NULL,
  expired BIGINT NOT NULL
);