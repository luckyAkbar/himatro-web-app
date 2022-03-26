const namaFormatter = (nama) => {
  let formatted = String(nama).trim().toLowerCase();
  formatted = formatted.split(' ');

  for (let i = 0; i < formatted.length; i += 1) {
    formatted[i] = formatted[i][0].toUpperCase() + formatted[i].substr(1);
  }

  formatted = formatted.join(' ');
  return formatted;
};

const formatToLowercase = (str) => String(str).toLowerCase();

const formatToCamelCase = (attributeName) => {
  let camelCased = String(formatToLowercase(attributeName)).trim();
  camelCased = camelCased.split(' ');

  for (let i = 1; i < camelCased.length; i += 1) {
    camelCased[i] = camelCased[i][0].toUpperCase() + camelCased[i].substr(1);
  }

  return camelCased.join('');
};

const formatToCapitalizeEach = (targetString) => namaFormatter(targetString);

module.exports = {
  namaFormatter,
  formatToLowercase,
  formatToCamelCase,
  formatToCapitalizeEach,
};
