const xssFilter = require('xss');

const XSSFilterOnTextInputType = (unsafeValue) => {
  if (typeof(unsafeValue) !== 'string') return unsafeValue;

  const saveValue = xssFilter(unsafeValue, {
    whiteList:          [],
    stripIgnoreTag:     true,
    stripIgnoreTagBody: ['script'],
  });

  return saveValue;
}

module.exports = { XSSFilterOnTextInputType };