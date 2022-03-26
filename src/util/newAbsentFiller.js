const { CustomError } = require("../classes/CustomError");
const { testQuery } = require("../../db/connection");

const { formatDateToStandartFormat, getTimeStamp } = require("./getTimeStamp");

const {
  namaValidator,
  NPMValidator,
  keteranganAbsentValidator,
} = require("./newValidator");

const insertKehadiranRecord = async (queryParams, bodyRequest) => {
  const { absentId } = queryParams;
  const waktuPengisian = getTimeStamp();
  const { npm, keterangan, alasan = null } = bodyRequest;
  const query =
    "UPDATE absensi SET keterangan = $1, alasan_izin = $2, waktu_pengisian = $3 WHERE npm = $4 AND referensi_id = $5";
  const params = [keterangan, alasan, waktuPengisian, npm, absentId];

  try {
    await testQuery(query, params);
  } catch (e) {
    throw new CustomError(
      "Maaf, server gagal memasukan data anda ke dalam daftar absensi.",
      500
    );
  }
};

const checkIfUserAlreadyFilledAbsentForm = async (NPM, absentId) => {
  const query =
    "SELECT keterangan FROM absensi WHERE npm = $1 AND referensi_id = $2";
  const params = [NPM, absentId];

  try {
    const { rows } = await testQuery(query, params);
    if (rows[0].keterangan !== null) throw new Error();
  } catch (e) {
    throw new CustomError(
      "Anda sudah mengisi form ini, dan tidak bisa mengubahnya."
    );
  }
};

const getFormAbsentDetails = async (absentId) => {
  const query = "SELECT * FROM kegiatan WHERE kegiatan_id = $1";
  const params = [absentId];

  try {
    const { rows, rowCount } = await testQuery(query, params);

    if (rowCount === 0) throw new Error();

    return {
      namaKegiatan: rows[0].nama_kegiatan,
      tanggalPelaksanaan: rows[0].tanggal_pelaksanaan,
      tanggalBerakhir: rows[0].tanggal_berakhir,
    };
  } catch (e) {
    throw new CustomError("Absent form not found.", 404);
  }
};

const validateAbsentFormWriteableStatusFromDate = ({
  tanggalPelaksanaan,
  tanggalBerakhir,
  namaKegiatan,
}) => {
  const now = new Date();

  now.setHours(now.getHours() + 7);

  const stillClosedErrorMsg = `Form absen ${namaKegiatan} akan dibuka pada ${formatDateToStandartFormat(
    tanggalPelaksanaan
  )}`;
  const alreadyClosedErrorMsg = `Form absen untuk ${namaKegiatan} sudah ditutup pada ${formatDateToStandartFormat(
    tanggalBerakhir
  )}`;

  if (tanggalPelaksanaan > now) throw new CustomError(stillClosedErrorMsg);
  if (tanggalBerakhir < now) throw new CustomError(alreadyClosedErrorMsg);
};

const checkIsNPMExistsOnPengurusTable = async (NPM) => {
  const query = "SELECT * FROM pengurus WHERE npm = $1";
  const params = [NPM];

  try {
    const { rowCount } = await testQuery(query, params);

    if (rowCount === 0) throw new Error();
  } catch (e) {
    throw new CustomError(
      "Maaf, NPM anda tidak ditemukan sebagai pengurus Himatro.",
      404
    );
  }
};

const checkIsNPMExistsOnAbsentEntry = async (absentId, NPM) => {
  const query = "SELECT nama FROM absensi WHERE npm = $1 and referensi_id = $2";
  const params = [NPM, absentId];

  try {
    const { rowCount } = await testQuery(query, params);

    if (rowCount === 0) throw new Error();
  } catch (e) {
    throw new CustomError(
      "Maaf, NPM anda tidak ditemukan di daftar absensi. Mohon periksa NPM anda.",
      404
    );
  }
};

const validateAbsentFormInputData = async (bodyRequest, absentId) => {
  const { nama, npm, keterangan, alasan } = bodyRequest;

  try {
    namaValidator(nama);
    NPMValidator(npm);
    keteranganAbsentValidator(keterangan, alasan);
    await checkIsNPMExistsOnAbsentEntry(absentId, npm);
  } catch (e) {
    throw new CustomError(e.message, e.httpErrorStatus);
  }
};

const checkIsAbsentFormWriteable = async (absentId) => {
  try {
    const result = await getFormAbsentDetails(absentId);
    validateAbsentFormWriteableStatusFromDate(result);
  } catch (e) {
    throw new CustomError(e.message, e.httpErrorStatus);
  }
};

module.exports = {
  checkIsAbsentFormWriteable,
  validateAbsentFormInputData,
  checkIsNPMExistsOnPengurusTable,
  insertKehadiranRecord,
  checkIfUserAlreadyFilledAbsentForm,
};
