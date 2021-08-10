DROP VIEW get_all_basis_sementara;
DROP VIEW get_all_daftar_hadir;
DROP TABLE IF EXISTS basis_sementara;
DROP TABLE IF EXISTS daftar_hadir;

CREATE TABLE basis_sementara (
  npm VARCHAR(10) PRIMARY KEY,
  nama VARCHAR(255) NOT NULL
);

CREATE TABLE daftar_hadir (
  referensi_id VARCHAR(10) NOT NULL,
  npm VARCHAR(10) NOT NULL,
  nama VARCHAR(255) NOT NULL,
  kehadiran BOOLEAN NOT NULL DEFAULT 'f'
);

INSERT INTO basis_sementara (npm, nama) VALUES (
  '1915061056', 'Lucky Akbar'
);

INSERT INTO basis_sementara (npm, nama) VALUES (
  '1915061055', 'M. A. Hilmy'
);

INSERT INTO basis_sementara (npm, nama) VALUES (
  '1915061011', 'Irfan Pramuditya'
);

INSERT INTO basis_sementara (npm, nama) VALUES (
  '1915061010', 'Hardi Nuari Caesar'
);

CREATE VIEW get_all_basis_sementara AS
  SELECT * FROM basis_sementara;

CREATE VIEW get_all_daftar_hadir AS
  SELECT * FROM daftar_hadir ORDER BY kehadiran;
