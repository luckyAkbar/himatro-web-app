const keteranganButton = document.getElementById('keterangan');
const alasanForm = document.getElementById('submitAlasan');
let isAlasanInputAlreadyShow = false;

const appendAlasanForm = () => {
  const alasanFormLabel = document.createElement('label');
  alasanFormLabel.innerText = 'Alasan Izin: ';
  alasanFormLabel.setAttribute('for', 'alasan')

  const alasanFormInput = document.createElement('input');
  alasanFormInput.setAttribute('placeholder', 'Masukan alasan anda izin...');
  alasanFormInput.setAttribute('name', 'alasan');
  alasanFormInput.setAttribute('id', 'alasan');
  alasanFormInput.setAttribute('type', 'text');

  alasanForm.appendChild(alasanFormLabel);
  alasanForm.appendChild(alasanFormInput);
};

const removeAlasanForm = () => {
  while (alasanForm.hasChildNodes()) {
    alasanForm.removeChild(alasanForm.firstChild);
  }
};

keteranganButton.addEventListener('click', () => {
  if (keteranganButton.value === 'i' && !isAlasanInputAlreadyShow) {
    appendAlasanForm();
    isAlasanInputAlreadyShow = true;
  }

  if (keteranganButton.value === 'h' && isAlasanInputAlreadyShow) {
    removeAlasanForm();
    isAlasanInputAlreadyShow = false;
  }
});