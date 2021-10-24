const { generateErrorEmail } = require('../util/email');
const { validateAbsentFormDetailData } = require('../util/newValidator');
const { referensiIdGenerator } = require('../util/generator');
const { CustomError } = require('../classes/CustomError');

const {
  createNewAbsent,
  createNewKegiatan,
} = require('../util/createNewAbsent');

const createNewAbsentRecord = async (bodyRequest) => {
  const refId = referensiIdGenerator('keg');
  try {
    const kegiatanData = {
      namaKegiatan: bodyRequest.namaKegiatan,
      mulai: `${bodyRequest.tanggalPelaksanaan} ${bodyRequest.jamPelaksanaan}`,
      akhir: `${bodyRequest.tanggalBerakhir} ${bodyRequest.jamBerakhir}`,
      lingkup: bodyRequest.lingkup,
    };

    await createNewAbsent(refId, bodyRequest.lingkup);
    await createNewKegiatan(refId, kegiatanData);
  } catch (e) {
    throw new CustomError('System failed to create new absent record');
  }
};

const createNewKegiatanFeature = async (req, res) => {
  try {
    validateAbsentFormDetailData(req.body);
  } catch (e) {
    console.log(e);
    res.status(e.httpErrorStatus).json({ errorMessage: e.message });
    return;
  }

  res.status(201).json({ successMessage: 'Data diterima, permintaan anda sedang diproses. Silahkan refresh halaman admin untuk melihat ID absesi dari kegiatan yang telah anda buat.' });

  try {
    await createNewAbsentRecord(req.body);
  } catch (e) {
    await generateErrorEmail(`Failed to create new absent record. issuer ${req.email} recently`);
  }
};

module.exports = { createNewKegiatanFeature };
