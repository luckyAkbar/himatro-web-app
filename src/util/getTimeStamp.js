const date = require('date-and-time');

const getTimeStamp = () => {
  const now = new Date();

  const timestamp = date.format(now, 'YYYY/MM/DD HH:mm:ss');
  return timestamp;
};

const getSecondsAfterEpoch = () => {
  const now = new Date();
  return Math.floor(now / 1000);
};

const formatDateToStandartFormat = (datetime) => date.format(datetime, 'YYYY/MM/DD HH:mm:ss');

module.exports = {
  getTimeStamp,
  getSecondsAfterEpoch,
  formatDateToStandartFormat,
};
