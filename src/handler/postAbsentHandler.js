const { insertKehadiranRecord } = require('../util/newAbsentFiller');

const postAbsentHandler = async (req, res) => {
  const { nama } = req.body;
  const bodyRequest = req.body;
  const queryParams = req.params;

  try {
    await insertKehadiranRecord(queryParams, bodyRequest);

    res.status(200).render('successAbsent', {
      nama,
      link: `/absensi/${queryParams.absentId}/result`,
    });
  } catch (e) {
    res.status(e.httpErrorStatus).render('errorPage', {
      errorMessage: e.message,
    });
  }
};

module.exports = { postAbsentHandler };
