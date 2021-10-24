const { CustomError } = require('../classes/CustomError');

const superStirctSQLInjectionComparator = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
const namaComparator = /[!@#$%^&*()_+\-=\[\]{};:"\\|<>\/?]+/; /* allowing [. , '] */
const numberOnlyValidator = /[a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z]/;
const letterOnlyValidator = /[1,2,3,4,5,6,7,8,9,0]/;
const timeFormatComparator = /[!@#$%^&*()_+\-=\[\]{};'"\\|,.<>\/?]+/;

const absentIdValidator = (absentId) => {
  const err = new CustomError('Sepertinya ID absent yang anda masukan salah. Mohon periksa ulang');
  const absentIdString = String(absentId).trim();

  if (absentIdString.length !== 10) throw err;
  if (!(absentIdString.startsWith('keg') || absentIdString.startsWith('sdm'))) throw err;
  if (superStirctSQLInjectionComparator.test(absentIdString)) throw err;
};

const absentModeValidator = (absentMode) => {
  if (absentMode === undefined) return;
  if (absentMode !== 'viewResult') throw new CustomError('Absen mode yang anda inginkan ilegal.');
};

const sortByAbsentQueryValidator = (sortBy) => {
  const err = new CustomError('sortBy query is not valid');

  if (sortBy === undefined) return;
  if (sortBy !== 'keterangan' && sortBy !== 'divisi' && sortBy !== 'waktu_pengisian') throw err;
};

const namaValidator = (inputNama) => {
  const nama = String(inputNama).trim();

  if (nama.length > 255) throw new CustomError('Namamu ditolak, sebab terlalu panjang.');
  if (namaComparator.test(nama)) throw new CustomError('Namamu ditolak, sebab mengandung karakter ilegal.');
  if (letterOnlyValidator.test(nama)) throw new CustomError('Namamu ditolak, karena mengandung angka.');
};

const NPMValidator = (inputNPM) => {
  const NPM = String(inputNPM).trim();

  if (NPM.length !== 10) throw new CustomError('NPM anda tidak valid, sebab tidak berjumlah 10 digit.');
  if (numberOnlyValidator.test(NPM)) throw new CustomError('NPM anda tidak valid, sebab mengandung huruf.');
  if (superStirctSQLInjectionComparator.test(NPM)) throw new CustomError('NPM anda tidak valid, sebab mengandung karakter ilegal');
};

const namaKegiatanValidator = (inputNamaKegiatan) => {
  const namaKegiatan = String(inputNamaKegiatan).trim();

  if (namaKegiatan === '') throw new CustomError('Nama kegiatan tidak boleh kosong.');
  if (namaKegiatan.length > 255) throw new CustomError('Nama kegiatan terlalu panjang');
  if (namaComparator.test(namaKegiatan)) throw new CustomError('Nama kegiatan tidak valid sebab mengandung tanda baca ilegal');
};

const tanggalValidator = (inputTanggal) => {
  const tanggal = String(inputTanggal).trim().toLowerCase();
  const date = new Date(tanggal);

  if (tanggal === '') throw new CustomError('Tanggal pelaksanaan / tanggal berakhir tidak boleh kosong.');
  if (tanggal.length > 10) throw new CustomError('Sepertinya input tanggal yang anda berikan tidak didukung');
  if (date.toString() === 'Invalid Date') throw new CustomError('Format tanggal yang anda berikan tidak valid');
};

const timeValidator = (inputTime) => {
  const time = String(inputTime).trim().toLowerCase();
  const timeComponent = time.split(':');
  const err = new CustomError('Format waktu tidak valid');

  if (time.length !== 5) throw err;
  if (timeComponent.length !== 2) throw err;
  if (timeFormatComparator.test(time)) throw err;
  if (numberOnlyValidator.test(time)) throw err;
  if (Number(timeComponent[0]) > 24) throw err;
  if (Number(timeComponent[1]) > 60) throw err;
};

const lingkupValidator = (inputLingkup) => {
  const lingkup = String(inputLingkup).trim();
  const possibleLingkupValue = [
    'seluruhAnggota', 'kpo', 'ppd',
    'soswir', 'kominfo', 'bangtek', 'ph',
  ];

  if (possibleLingkupValue.indexOf(lingkup) === -1) throw new CustomError('Sepertinya anda memasukan nilai lingkup yang tidak didukung.');
};

const validateAbsentFormDetailData = (bodyRequest) => {
  const {
    namaKegiatan,
    tanggalPelaksanaan,
    jamPelaksanaan = '00:00:00',
    tanggalBerakhir,
    jamBerakhir = '23:59:59',
    lingkup,
  } = bodyRequest;

  namaKegiatanValidator(namaKegiatan);
  tanggalValidator(tanggalPelaksanaan);
  tanggalValidator(tanggalBerakhir);
  timeValidator(jamPelaksanaan);
  timeValidator(jamBerakhir);
  lingkupValidator(lingkup);
};

const keteranganAbsentValidator = (inputKeterangan, inputAlasan) => {
  const alasan = String(inputAlasan).trim().replace(/ /g, '');

  if (inputKeterangan !== 'i' && inputKeterangan !== 'h' && inputKeterangan !== 's') throw new CustomError('Keterangan absen tidak valid');
  if (inputKeterangan !== 'h' && (alasan === '' || alasan.length < 25)) throw new CustomError('Mohon masukan alasan anda izin / sakit dengan kalimat deskriptif minimal 25 huruf.');
};

module.exports = {
  absentIdValidator,
  absentModeValidator,
  sortByAbsentQueryValidator,
  namaValidator,
  NPMValidator,
  keteranganAbsentValidator,
  validateAbsentFormDetailData,
};
