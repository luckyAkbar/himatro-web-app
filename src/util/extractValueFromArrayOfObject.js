const extractValueFromArrayOfObject = (arrOfObject, keyName) => {
  const arr = [];

  arrOfObject.forEach((object) => {
    arr.push(object[keyName]);
  })

  return arr;
}

module.exports = { extractValueFromArrayOfObject };