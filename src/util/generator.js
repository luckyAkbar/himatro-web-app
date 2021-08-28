const generateUniqueId = require('generate-unique-id')

const excludedSymbols = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '-', '=', '[', ']', '{', '}', ';', ':', `"`, '|', ',', '.', '<', '>', '?', ']', '+']

const referensiIdGenerator = (option) => {
  if (option === 'keg') {
    return `keg${generateUniqueId({
      length: 7,
      excludeSymbols: excludedSymbols,
      useLetters: false
    })}`
  }
}

const sdmUIDGenerator = () => {
  return `sdm${generateUniqueId({
    length: 7,
    excludeSymbols: excludedSymbols,
    useNumbers: true,
    useLetters: false
  })}`
}

const uploadedImageNameGenerator = () => {
  return `${generateUniqueId({
    length: 15,
    excludeSymbols: excludedSymbols,
    useLetters: true,
    useNumbers: false
  })}`
}

const imageIdGenerator = () => {
  return `${generateUniqueId({
    length: 10,
    excludeSymbols: excludedSymbols,
    useLetters: true,
    useNumbers: true
  })}`
}

const sessionGenerator = () => {
  return `${generateUniqueId({
    length: 10,
    excludeSymbols: excludedSymbols,
    useLetters: true,
    useNumbers: true
  })}`
}

const sessionIdGenerator = () => {
  return `${generateUniqueId({
    length: 5,
    excludeSymbols: excludedSymbols,
    useLetters: true,
    useNumbers: true
  })}`
}

module.exports = {
  referensiIdGenerator,
  uploadedImageNameGenerator,
  sdmUIDGenerator,
  imageIdGenerator,
  sessionGenerator,
  sessionIdGenerator
 }
