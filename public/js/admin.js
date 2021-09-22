const buttonAbsentPengurus = document.getElementById('btnAbsenPengurus');
const buttonSocmedValidator = document.getElementById('btnSocmedPostValidation');

const checkIfDataIsNull = (dataList, object) => {
  let dataIsNull = false;

  dataList.forEach((atributName) => {
    if (String(object[atributName]).trim() === '') {
      dataIsNull = true;
    }
  });
  /*
  for (const atributName in dataList) {
    const value = String(object[atributName].value).trim();

    if (value === null || value === '') return true;
  }
  */

  return dataIsNull;
};

const validateAbsentPengurusData = (object) => {
  const dataList = [
    'lingkup',
    'namaKegiatan',
    'tanggalPelaksanaan',
    'jamPelaksanaan',
    'tanggalBerakhir',
    'jamBerakhir',
  ];

  if (checkIfDataIsNull(dataList, object)) return false;

  return true;
};

const validateSocmedPostData = (formObject) => {
  const dataList = [
    'namaPostingan',
    'tanggalPelaksanaan',
    'tanggalBerakhir',
    'keyword',
  ];

  if (checkIfDataIsNull(dataList, formObject)) {
    alert('Mohon penuhi semua data yang diperlukan terlebih dahulu');
    return false;
  }

  return true;
};

const postData = async (payload, targetEndpoint) => {
  try {
    const response = await fetch(targetEndpoint, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return await response.json();
  } catch (e) {
    console.log(e);
    return { errorMessage: 'Network Error. Please check your connection' };
  }
};

const newPostData = async (payload, endpoint) => {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return response;
  } catch (e) {
    console.log(e);
    return { errorMessage: 'Network Error. Please check your connection' };
  }
};

const checkBackwardDate = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  if (end < start) return true;
  if (end < now) return true;
  return false;
};

buttonAbsentPengurus.addEventListener('click', async () => {
  const formAbsenPengurus = document.forms.createAbsent;

  if (!validateAbsentPengurusData(formAbsenPengurus)) {
    alert('Mohon penuhi semua data terlebih dahulu');
    return;
  }

  const start = `${formAbsenPengurus.tanggalPelaksanaan.value} ${formAbsenPengurus.jamPelaksanaan.value}`;
  const end = `${formAbsenPengurus.tanggalBerakhir.value} ${formAbsenPengurus.jamBerakhir.value}`;

  if (checkBackwardDate(start, end)) {
    alert('Penggunaan tanggal lampau atau terbalik, mohon perbaiki terlebih dahulu');
    return;
  }

  document.body.style.cursor = 'wait';
  buttonAbsentPengurus.style.cursor = 'wait';

  const payload = {
    lingkup: formAbsenPengurus.lingkup.value,
    namaKegiatan: formAbsenPengurus.namaKegiatan.value,
    tanggalPelaksanaan: formAbsenPengurus.tanggalPelaksanaan.value,
    jamPelaksanaan: formAbsenPengurus.jamPelaksanaan.value,
    tanggalBerakhir: formAbsenPengurus.tanggalBerakhir.value,
    jamBerakhir: formAbsenPengurus.jamBerakhir.value,
  };

  const targetEndpoint = 'http://localhost:3000/feature/feature001';
  try {
    const response = await postData(payload, targetEndpoint);

    alert(response.errorMessage || response.successMessage);
    document.body.style.cursor = 'default';
    buttonAbsentPengurus.style.cursor = 'default';
  } catch (e) {
    alert('failed to post request.');
  }
});

buttonSocmedValidator.addEventListener('click', async () => {
  const form = document.forms.socmedPostValidation;

  if (!validateSocmedPostData(form)) return;

  if (checkBackwardDate(form.tanggalPelaksanaan.value, form.tanggalBerakhir.value)) {
    alert('Penggunaan tanggal lampau (terbalik). Mohon perbaiki terlebih dahulu');
    return;
  }

  document.body.style.cursor = 'wait';
  buttonSocmedValidator.style.cursor = 'wait';

  const targetEndpoint = 'http://localhost:3000/feature/feature003';
  const payload = {
    postName: form.namaPostingan.value,
    startAt: form.tanggalPelaksanaan.value,
    expiredAt: form.tanggalBerakhir.value,
    keyword: form.keyword.value,
  };

  try {
    const rawResponse = await newPostData(payload, targetEndpoint);
    const response = await rawResponse.json();

    if (rawResponse.status >= 400) alert(response.errorMessage);
    else if (rawResponse.status === 201) alert(`${response.successMessage} Here is your post validation form id: ${response.id}`);
  } catch (e) {
    alert('Network error. Please check your connection');
  } finally {
    document.body.style.cursor = 'default';
    buttonSocmedValidator.style.cursor = 'default';
  }
});
