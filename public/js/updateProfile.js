const departemen = document.getElementById('departemen');
const divisi = document.getElementById('divisi');
const jabatan = document.getElementById('jabatan');
const modal = document.getElementById('myModal');
const spanCloseModal = document.getElementsByClassName('close')[0];
const buttonModalOpen = document.getElementById('modal-btn');
const modalData = document.querySelectorAll('.modal-data');
const finalSubmit = document.getElementById('finalSubmit');

let departemenValue;
let isAlreadySelected = null;
let divisiChildLists = [];
let jabatanChildList = [];

const removeSelectChild = (parent) => {
  while (parent.hasChildNodes()) {
    parent.removeChild(parent.firstChild);
  }
};

const createElement = (parent, childLists) => {
  for (let i = 0; i < childLists.length; i += 1) {
    const newValue = document.createElement('option');
    const textInside = document.createTextNode(childLists[i]);

    newValue.setAttribute('value', childLists[i]);
    newValue.appendChild(textInside);
    parent.appendChild(newValue);
    isAlreadySelected = true;
  }
};

const getProfileFormData = (index) => document.body.children[0].children[1].children[index].children[1].children[0].value;

const fillModalData = () => {
  const formLength = 19;

  for (let i = 0; i < formLength; i += 1) {
    modalData[i].innerText = getProfileFormData(i);
  }
};

const removeAllSpaces = (string) => string.split(' ').join('');

const validateProfileData = () => {
  // document.body.children[0].children[1].children[18].children[1].children[0].value
  const formLength = 19;
  let valid = true;
  for (let i = 0; i < formLength; i += 1) {
    if (removeAllSpaces(getProfileFormData(i)) === '' || removeAllSpaces(getProfileFormData(i)) === 'blank') {
      valid = false;
      break;
    }
  }

  return valid;
};

const postUpdateProfileData = async () => {
  const data = {
    nama: getProfileFormData(0),
    npm: getProfileFormData(1),
    prodi: getProfileFormData(2),
    departemen: getProfileFormData(3),
    divisi: getProfileFormData(4),
    jabatan: getProfileFormData(5),
    tempatLahir: getProfileFormData(6),
    tanggalLahir: getProfileFormData(7),
    golonganDarah: getProfileFormData(8),
    alamat: getProfileFormData(9),
    noTelp: getProfileFormData(10),
    noWA: getProfileFormData(11),
    noTele: getProfileFormData(12),
    ig: getProfileFormData(13),
    jalurMasuk: getProfileFormData(14),
    hobi: getProfileFormData(15),
    keahlian: getProfileFormData(16),
    ipk: getProfileFormData(17),
    riwayatPenyakit: getProfileFormData(18),
  };

  const payload = JSON.stringify(data);

  try {
    const response = await fetch('/profile/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
    });

    if (response.status === 200) {
      const { message } = await response.json();
      alert(message);
      window.location.href = '/profile';
    } else if (response.status >= 400) {
      const { errorMessage } = await response.json();
      alert(errorMessage);
    }
  } catch (e) {
    alert(e);
  }
};

departemen.addEventListener('click', () => {
  departemenValue = departemen.value;

  switch (departemenValue) {
    case 'Pengurus Harian':
      divisiChildLists = [
        'Pengurus Harian',
      ];
      jabatanChildList = [
        'Ketua',
        'Wakil Ketua',
        'Sekertaris Umum',
        'Wakil Sekertaris Umum',
        'Bendahara',
        'Wakil Bendahara',
      ];
      break;

    case 'Pendidikan dan Pengembangan Diri':
      divisiChildLists = [
        'Pimpinan (kadep / kadiv / sekdep)',
        'Minat dan Bakat',
        'Pendidikan',
        'Kerohanian',
      ];
      jabatanChildList = [
        'Kepala Departemen',
        'Sekertaris Departemen',
        'Kepala Divisi',
        'Anggota',
      ];
      break;

    case 'Kaderisasi dan Pengembangan Organisasi':
      divisiChildLists = [
        'Pimpinan (kadep / kadiv / sekdep)',
        'Kaderisasi dan Pengembangan Organisasi',
      ];
      jabatanChildList = [
        'Kepala Departemen',
        'Sekertaris Departemen',
        'Anggota',
      ];
      break;

    case 'Sosial dan Kewirausahaan':
      divisiChildLists = [
        'Pimpinan (kadep / kadiv / sekdep)',
        'Sosial',
        'Kewirausahaan',
      ];
      jabatanChildList = [
        'Kepala Departemen',
        'Sekertaris Departemen',
        'Kepala Divisi',
        'Anggota',
      ];
      break;

    case 'Komunikasi dan Informasi':
      divisiChildLists = [
        'Pimpinan (kadep / kadiv / sekdep)',
        'Media Informasi',
        'Hubungan Masyarakat',
      ];
      jabatanChildList = [
        'Kepala Departemen',
        'Sekertaris Departemen',
        'Kepala Divisi',
        'Anggota',
      ];
      break;

    case 'Pengembangan Keteknikan':
      divisiChildLists = [
        'Pimpinan (kadep / kadiv / sekdep)',
        'Penelitian dan Pengembangan',
        'Pengabdian Masyarakat',
      ];
      jabatanChildList = [
        'Kepala Departemen',
        'Sekertaris Departemen',
        'Kepala Divisi',
        'Anggota',
      ];
      break;
    default:
  }

  removeSelectChild(divisi);
  removeSelectChild(jabatan);
  createElement(divisi, divisiChildLists);
  createElement(jabatan, jabatanChildList);
});

buttonModalOpen.addEventListener('click', () => {
  const isDataValid = validateProfileData();

  if (isDataValid) {
    fillModalData();
    modal.style.display = 'block';
  } else {
    alert('Mohon isi seluruh data terlebih dahulu');
  }
});

spanCloseModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

finalSubmit.addEventListener('click', async () => {
  try {
    await postUpdateProfileData();
  } catch (e) {
    alert(e);
  }
});
