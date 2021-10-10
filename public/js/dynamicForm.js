const formId = 'form2ua9bq';
const form = document.getElementById('mainForm');
const requiredStarMark = '<span style="color: red; font-size: 1rem;"> *</span>';

const getFormShape = async () => {
  const url = `/feature/feature006?formId=${formId}`;
  const options = {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
  };

  const result = await fetch(url, options);
  const jsonResult = await result.json();

  if (result.status !== 200) throw new Error(jsonResult.errorMessage);

  return jsonResult;
};

const generateTextInputTypeElement = (data, parentForm) => {
  const formElementContainer = document.createElement('div');
  const elementTitle = document.createElement('p');
  const inputElement = document.createElement('input');

  formElementContainer.setAttribute('class', 'form-element');

  elementTitle.setAttribute('class', 'element-title');
  elementTitle.innerText = data.elementTitle;

  inputElement.setAttribute('name', data.elementTitle);
  inputElement.setAttribute('id', data.attributeName);
  inputElement.setAttribute('type', data.HTMLInputType);
  inputElement.setAttribute('placeholder', 'Jawaban Anda');

  if (data.isRequired) {
    inputElement.setAttribute('required', data.isRequired);
    elementTitle.innerHTML += requiredStarMark;
  }

  formElementContainer.appendChild(elementTitle);
  formElementContainer.appendChild(inputElement);

  parentForm.appendChild(formElementContainer);
};

const generateRadioAndCheckboxInputTypeElement = (data, parentForm) => {
  const { choices } = data;
  const formElementContainer = document.createElement('div');
  const elementTitle = document.createElement('p');
  let firstRadioChecked = false;

  formElementContainer.setAttribute('class', 'form-element');

  elementTitle.setAttribute('class', 'element-title');
  elementTitle.innerText = data.elementTitle;

  if (data.isRequired) elementTitle.innerHTML += requiredStarMark;

  formElementContainer.appendChild(elementTitle);

  choices.forEach((choice) => {
    const inputElement = document.createElement('input');
    const labelRadioInput = document.createElement('label');
    const lineBreak = document.createElement('br');

    inputElement.setAttribute('type', data.HTMLInputType);
    inputElement.setAttribute('name', data.attributeName);
    inputElement.setAttribute('id', data.attributeName);
    inputElement.setAttribute('value', choice);

    if (data.HTMLInputType === 'radio' && !firstRadioChecked && data.isRequired) {
      inputElement.setAttribute('checked', true);
      firstRadioChecked = true;
    }

    labelRadioInput.setAttribute('for', data.attributeName);
    labelRadioInput.innerText = choice;

    formElementContainer.appendChild(inputElement);
    formElementContainer.appendChild(labelRadioInput);
    formElementContainer.appendChild(lineBreak);
  });

  parentForm.appendChild(formElementContainer);
}

const createFormElement = (formData, parentForm) => {
  formData.forEach((data) => {
    if (data.HTMLInputType === 'text') {
      generateTextInputTypeElement(data, parentForm);
      return;
    }
    generateRadioAndCheckboxInputTypeElement(data, parentForm);
  });
};

const validateTextInputType = (attributeName, fieldName) => {
  const value = String(document.getElementById(attributeName).value).trim();

  if(value === '') throw new Error(`Mohon isi bagian ${fieldName} terlebih dahulu`)
};

const validateRadioInputType = (attributeName, fieldName) => {
  const value = document.querySelector(`input[name='${attributeName}']:checked`).value;
  
  if (!value) throw new Error(`Mohon isi ${fieldName} terlebih dahulu`);
};

const validateCheckboxInputType = (attributeName, fieldName) => {
  const checkboxInputChecked = document.querySelectorAll(`input[name='${attributeName}']:checked`);

  if (checkboxInputChecked.length === 0) throw new Error (`Mohon pilih salah satu dari ${fieldName} terlebih dahulu`);
};

const eraseTextInputField = (attributeName) => {
  const textInput = document.getElementById(attributeName);
  textInput.value = '';
}

const unselectRadioButton = (attributeName) => {
  try {
    const checkedRadioButton = document.querySelector(`input[name='${attributeName}']:checked`);
    checkedRadioButton.checked = false;
  } catch (e) {
    return;
  }
}

const unselectCheckboxButton = (attributeName) => {
  try {
    const checkboxInputChecked = document.querySelectorAll(`input[name='${attributeName}']:checked`);
    checkboxInputChecked.forEach((checkbox) => {
      checkbox.checked = false;
    });
  } catch (e) {
    return;
  }
}

const getTextInputElement = (attributeName, fullData, isRequired) => {
  const data = document.getElementById(attributeName).value;

  if (!data && !isRequired) return;

  fullData[attributeName] = data;
}

const getRadioInputElement = (attributeName, fullData, isRequired) => {
  const data = document.querySelector(`input[name='${attributeName}']:checked`);

  if (!data && !isRequired) return;

  fullData[attributeName] = data.value;
}

const getCheckboxInputElement = (attributeName, fullData, isRequired) => {
  const data = document.querySelectorAll(`input[name='${attributeName}']:checked`);

  if (data.length === 0 && !isRequired) return;

  let allCheckedValue = [];

  data.forEach((input) => {
    allCheckedValue.push(input.value);
  });

  fullData[attributeName] = allCheckedValue;
}

const getAllData = (formShape, formToken) => {
  let fullData = {};
  
  formShape.forEach((formData) => {
    const inputType = formData.HTMLInputType;
    const attributeName = formData.attributeName;
    const isRequired = formData.isRequired;

    if (inputType === 'text') getTextInputElement(attributeName, fullData, isRequired);
    if (inputType === 'radio') getRadioInputElement(attributeName, fullData, isRequired);
    if (inputType === 'checkbox') getCheckboxInputElement(attributeName, fullData, isRequired);
  });

  fullData.formToken = formToken;
  return fullData;
}

const postData = async (formShape, URL, formToken) => {
  const fullInputData = getAllData(formShape, formToken);
  const bodyRequest = JSON.stringify(fullInputData);
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    mode: 'cors',
    body: bodyRequest,
  }

  try {
    const rawResponse = await fetch(URL, options);
    const response = await rawResponse.json();

    if (rawResponse.status !== 200) throw new Error(response.errorMessage);

    alert(response.message);
    window.location.href = response.URLRedirect ? response.URLRedirect: '/';
  } catch (e) {
    alert(e.message);
  }
}

const clearFormListener = (formData) => {
  for (let i = 0; i < formData.length; i += 1) {
    const required = formData[i].isRequired;
    const inputType = formData[i].HTMLInputType;
    const attributeName = formData[i].attributeName;

    if (required) continue;

    if (inputType === 'radio') unselectRadioButton(attributeName)
    if (inputType === 'checkbox') unselectCheckboxButton(attributeName);
    if (inputType === 'text') eraseTextInputField(attributeName);
  }
}

const formValidation = (formData) => {
  formData.forEach((data) => {
    const attributeName = data.attributeName;
    const fieldName = data.elementTitle;

    if (!data.isRequired) return;

    switch (data.HTMLInputType) {
      case 'text':
        validateTextInputType(attributeName, fieldName);
        break;
      case 'radio':
        validateRadioInputType(attributeName, fieldName);
        break;
      case 'checkbox':
        validateCheckboxInputType(attributeName, fieldName);
        break;
    }
  })
}

const attachSubmitButton = (parentForm, formShape, formToken) => {
  const URL = '/feature/feature006'
  const submitButton = document.createElement('input');

  submitButton.setAttribute('type', 'submit');
  submitButton.setAttribute('id', 'submitButton');
  submitButton.setAttribute('class', 'submit-button');
  submitButton.setAttribute('value', 'Submit');
  submitButton.addEventListener('click', async (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    submitButton.style.cursor = 'not-allowed';

    try {
      formValidation(formShape);
      await postData(formShape, URL, formToken);
    } catch (e) {
      alert(e.message);
    } finally {
      submitButton.disabled = false;
      submitButton.style.cursor = 'pointer';
    }
  })

  parentForm.appendChild(submitButton);
}

const attachClearFormButton = (formData, parentForm) => {
  const clearButton = document.createElement('button');

  clearButton.setAttribute('class', 'clear-button');
  clearButton.innerHTML = 'Reset'
  clearButton.addEventListener('click', (event) => {
    event.preventDefault();
    clearFormListener(formData);
  });

  parentForm.appendChild(clearButton);
}

const main = async () => {
  try {
    const { formShape, formToken } = await getFormShape();
    createFormElement(formShape, form);
    attachSubmitButton(form, formShape, formToken);
    attachClearFormButton(formShape, form);
  } catch (e) {
    console.log(e)
    alert(e.message);
  }
}

main();


/*
const endpoint = 'http://localhost:3000/feature/feature004?formId=formv4ha7p';

const getFormBody = async () => {
  try {
    const result = await fetch(endpoint, {
      method: 'GET',
      mode: 'no-cors'
    });
    const res = await result.json();
    console.log(res.formBody);
  } catch(e) {
    console.log(e);
  }
}

getFormBody();
*/