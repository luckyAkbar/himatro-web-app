const namaFormatter = (nama) => {
  let formatted = nama.toLowerCase();
  formatted = formatted.split(' ');

  for (let i = 0; i < formatted.length; i += 1) {
    formatted[i] = formatted[i][0].toUpperCase() + formatted[i].substr(1);
  }

  formatted = formatted.join(' ');
  return formatted;
};

const formatToLowercase = (str) => String(str).toLowerCase();

module.exports = {
  namaFormatter,
  formatToLowercase,
};
