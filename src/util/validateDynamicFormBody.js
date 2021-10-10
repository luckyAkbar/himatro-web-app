const { CustomError } = require("../classes/CustomError");

const validateCheckboxInput = (formShape, userInput) => {
  const {
    choices,
    isRequired,
    elementTitle,
  } = formShape;

  if (userInput === undefined && !isRequired) return;
  if (!Array.isArray(userInput)) throw new CustomError('Checkbox input can not have value other than array');
  if (userInput === undefined && isRequired) throw new CustomError(`${elementTitle} can't have null value`);

  userInput.forEach((data) => {
    if (choices.indexOf(data) === -1) throw new CustomError(`choice ${data} is not exists!`);
  });
}

const validateRadioInput = (formShape, userInput) => {
  const {
    choices,
    isRequired,
    elementTitle,
  } = formShape;

  if (!isRequired && userInput === undefined) return;
  if (isRequired && userInput === undefined) throw new CustomError(`${elementTitle} can't have null value.`);
  if (choices.indexOf(userInput) === -1) throw new CustomError(`choice ${userInput} is not exists!`);
}

const validateTextInput = (formShape, userInput) => {
  const {
    elementTitle,
    isRequired,
    datatype,
  } = formShape;

  if (!userInput  && !isRequired) return;
  if (!userInput && isRequired) throw new CustomError(`${elementTitle} can't have null value`);
  if (typeof(userInput) !== datatype && isRequired) throw new CustomError(`Invalid Datatype on ${elementTitle}`);
}

const validateDynamicFormBody = (formShape, bodyRequest) => {
  formShape.forEach((shape) => {
    const {
      HTMLInputType,
      attributeName,
    } = shape;

    const userInput = bodyRequest[attributeName];

    switch(HTMLInputType) {
      case 'checkbox':
        validateCheckboxInput(shape, userInput);
        break;
      
      case 'radio':
        validateRadioInput(shape, userInput);
        break;
      
      case 'text':
        validateTextInput(shape, userInput);
        break;
      
      default:
        throw new CustomError(`${HTMLInputType} type can't be validate on form body validator`, 500);
    };
  });
}

module.exports = { validateDynamicFormBody };