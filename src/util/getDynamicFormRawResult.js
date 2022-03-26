const { CustomError } = require('../classes/CustomError');
const { FormData } = require('../../models/formData');
const { DynamicFormDetail } = require('../../models/dynamicForm');
const { testQuery } = require('../../db/connection');
const { extractValueFromArrayOfObject } = require('./extractValueFromArrayOfObject');

const removeAlreadyFilledParticipants = (intendedParticipants, alreadyFilledParticipants) => {
  const intendedParticipantsNPM = extractValueFromArrayOfObject(intendedParticipants, 'npm');
  const { NPM } = alreadyFilledParticipants;
  let totalRemoved = 0;

  NPM.forEach((participants) => {
    const indexToRemove = intendedParticipantsNPM.indexOf(participants);
    if (indexToRemove !== -1) {
      intendedParticipants.splice(indexToRemove - totalRemoved, 1);
      totalRemoved += 1;
    }
  });

  return intendedParticipants;
};

const getAwaitingParticipantsList = async (scope, alreadyFilledParticipants) => {
  let query;
  let params;

  switch (scope) {
    case 'all':
      query = 'SELECT npm, nama FROM anggota_biasa WHERE npm IN (SELECT npm FROM pengurus)';
      params = [];
      break;

    case 'ph':
      query = 'SELECT npm, nama FROM anggota_biasa WHERE npm IN (SELECT npm FROM pengurus WHERE divisi_id = $1)';
      params = ['div0000001']; // divisi_id pengurus harian
      break;

    case 'kwu':
      query = 'SELECT npm FROM pengurus WHERE divisi_id = $1 OR divisi_id = $2';
      params = ['div0000006', 'div0000007']; // divisi_id untuk departemen KWU
      break;

    case 'ppd':
      query = 'SELECT npm FROM pengurus WHERE divisi_id = $1 OR divisi_id = $2 OR divisi_id = $3';
      params = ['div0000003', 'div0000004', 'div0000005']; // divisi_id untuk departemen ppd
      break;

    case 'bangtek':
      query = 'SELECT npm FROM pengurus WHERE divisi_id = $1 OR divisi_id = $2';
      params = ['div0000008', 'div0000009']; // divisi_id untuk departemen bangtek
      break;

    case 'kpo':
      query = 'SELECT npm FROM pengurus WHERE divisi_id = $1';
      params = ['div0000002']; // divisi_id dept kpo
      break;

    case 'kominfo':
      query = 'SELECT npm FROM pengurus WHERE divisi_id = $1 OR divisi_id = $2';
      params = ['div0000010', 'div0000011']; // divisi_id departemen kominfo
      break;

    default:
      throw new CustomError('Please specify scope first');
  }

  try {
    const { rows } = await testQuery(query, params);
    const intendedParticipants = removeAlreadyFilledParticipants(rows, alreadyFilledParticipants);

    return intendedParticipants;
  } catch (e) {
    throw new CustomError('Server failure to get intended participants.', 500);
  }
};

const generateWhereInQueryParamFromArray = (arrayInput) => {
  let paramString = '';

  arrayInput.forEach((data) => {
    paramString += `'${data}',`;
  });

  return paramString.substring(0, paramString.length - 1);
};

const getNPMFromDynamicFormFillerNPM = async (rawFormResult) => {
  const NPM = extractValueFromArrayOfObject(rawFormResult, 'filler');
  const query = `SELECT nama FROM anggota_biasa WHERE npm IN (${generateWhereInQueryParamFromArray(NPM)})`;

  try {
    const { rows } = await testQuery(query);
    const nama = extractValueFromArrayOfObject(rows, 'nama');

    return { NPM, nama };
  } catch (e) {
    throw new CustomError('Server failure to fetch NPM from given emails', 500);
  }
};

const getCleanDataFromRawResult = (dynamicFormResultData) => {
  const rawData = extractValueFromArrayOfObject(dynamicFormResultData, 'data');
  const fullData = [];

  rawData.forEach((data) => {
    fullData.push(JSON.parse(data));
  });

  return fullData;
};

const prettifyData = (cleanData, fillerData) => {
  const prettyData = [];

  for (let i = 0; i < fillerData.NPM.length; i += 1) {
    const obj = {
      NPM: fillerData.NPM[i],
      nama: fillerData.nama[i],
      data: cleanData[i],
    };

    prettyData.push(obj);
  }

  return prettyData;
};

const getDynamicFormRawResult = async (formId) => {
  if (!formId) throw new CustomError('Form Id must be supplied.');

  try {
    const dynamicFormResultData = await FormData.find({ formId }, {
      data: 1,
      filler: 1,
      _id: 0,
    });
    const { scope } = await DynamicFormDetail.findOne({ formId }, {
      _id: 0,
      scope: 1,
    });

    const fillerData = await getNPMFromDynamicFormFillerNPM(dynamicFormResultData);
    const awaitingParticipantsList = await getAwaitingParticipantsList(scope, fillerData);
    const cleanData = getCleanDataFromRawResult(dynamicFormResultData);
    const prettyData = prettifyData(cleanData, fillerData);

    return {
      awaitingParticipantsList,
      result: prettyData,
      totalAlreadyFilled: prettyData.length,
      totalAwaitingResponse: awaitingParticipantsList.length,
    };
  } catch (e) {
    console.log(e);
    throw new CustomError('Server failure to perform query in dynamic form insight', 500);
  }
};

module.exports = { getDynamicFormRawResult };
