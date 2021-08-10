const generateUniqueId = require('generate-unique-id')

const excludedSymbols = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '-', '=', '[', ']', '{', '}', ';', ':', `"`, '|', ',', '.', '<', '>', '?', ']', '+']

const referensiIdGenerator = (option) => {
  if (option === 'keg') {
    return `test${generateUniqueId({
      length: 6,
      excludeSymbols: excludedSymbols,
      useLetters: false
    })}`
  }
}

module.exports = { referensiIdGenerator }
