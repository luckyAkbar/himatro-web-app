const generateUniqueId = require('generate-unique-id');

const excludedSymbols = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '-', '=', '[', ']', '{', '}', ';', ':', '"', '|', ',', '.', '<', '>', '?', ']', '+'];

const referensiIdGenerator = (option = 'keg') => {
  if (option === 'keg') {
    return `keg${generateUniqueId({
      length: 7,
      excludeSymbols: excludedSymbols,
      useLetters: false,
    })}`;
  }

  return false;
};

const sdmUIDGenerator = () => `sdm${generateUniqueId({
  length: 7,
  excludeSymbols: excludedSymbols,
  useNumbers: true,
  useLetters: false,
})}`;

const uploadedImageNameGenerator = () => `${generateUniqueId({
  length: 15,
  excludeSymbols: excludedSymbols,
  useLetters: true,
  useNumbers: false,
})}`;

const imageIdGenerator = () => `${generateUniqueId({
  length: 10,
  excludeSymbols: excludedSymbols,
  useLetters: true,
  useNumbers: true,
})}`;

const sessionGenerator = () => `${generateUniqueId({
  length: 10,
  excludeSymbols: excludedSymbols,
  useLetters: true,
  useNumbers: true,
})}`;

const sessionIdGenerator = () => `${generateUniqueId({
  length: 5,
  excludeSymbols: excludedSymbols,
  useLetters: true,
  useNumbers: true,
})}`;

const initOnetimeSignupIdGenerator = () => `signup${generateUniqueId({
  length: 9,
  excludeSymbols: excludedSymbols,
  useLetters: true,
  useNumbers: true,
})}`;

const userPasswordGenerator = (npm) => `${npm}${generateUniqueId({
  length: 13,
  useLetters: true,
  useNumbers: true,
})}`;

const socmedPostIdGenerator = () => `smpv${generateUniqueId({
  length: 6,
  useLetters: true,
  useNumbers: true,
  excludeSymbols: excludedSymbols,
})}`;

module.exports = {
  referensiIdGenerator,
  uploadedImageNameGenerator,
  sdmUIDGenerator,
  imageIdGenerator,
  sessionGenerator,
  sessionIdGenerator,
  userPasswordGenerator,
  initOnetimeSignupIdGenerator,
  socmedPostIdGenerator,
};
