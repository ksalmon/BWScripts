const { constructApiRoot, constructV4ApiEndpoint } = require('./utils/apiHelpers');
const { LOCALE_ENDPOINT } = require('./utils/endpoints');
const api = require('./utils/callApi.js')

const inq = require('inquirer');

const { clientDirectory } = require('./utils/csvHelpers');
const csv = require('csv-parser')
const fs = require('fs')
const mkdirp = require('mkdirp');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;  

var filenameQuestionPrompt = [
  { type: 'input', name: 'filename', message: 'What will the filename be? Please include slash. Leave blank for default: "/locales.csv"' }
];

const init = (auth, data) => {
  var directory,
      filename;

  var defaultfilename = '/locales.csv';

  inq.prompt(filenameQuestionPrompt)
    .then(async (answer) => {
      filename = (answer.filename == '') ? defaultfilename : answer.filename;
      directory = clientDirectory(data.company, data.enviroment)
      const locales = await getLocales();
      return locales.data
    })
    .then(locales => {
      formatLocales(locales)
    })
    .catch(e => console.log(e));

  const getLocales = () => {
    const apiEndpoint = constructV4ApiEndpoint(data.enviroment, LOCALE_ENDPOINT );

    let settings = {
      url: apiEndpoint,
      method: 'get',
      headers: { 'Authorization': 'Bearer ' + auth.token, },
      params: {
        perPage: "100",
      },
    }

    return api.call(apiEndpoint, settings)
  }

  const formatLocales = (lc) => {
    let locales = [];
  
    lc.forEach(slc => {
      let locale = {
        id: slc.id,
        supported: slc.attributes.supported,
        custom: slc.attributes.custom,
        reactMapping: slc.attributes.reactMapping,
        momentMapping: slc.attributes.momentMapping,
        legacyMapping: slc.attributes.legacyMapping,
      }
      locales.push(locale)
    });
    mkdirp(directory, function(err) { 
      printToCSV(locales);
    });
  }

  const printToCSV = (data) => {
    const csvWriter = createCsvWriter({
      header: [
          {id: 'id', title: 'id'},
          {id: 'supported', title: 'supported'},
          {id: 'custom', title: 'custom'},
          {id: 'reactMapping', title: 'reactMapping'},
          {id: 'momentMapping', title: 'momentMapping'},
          {id: 'legacyMapping', title: 'legacyMapping'},
      ],
      append: false,
      path: directory + filename
    });
    csvWriter
      .writeRecords(data)
      .then(()=> console.log('The CSV file was written successfully'));
  }
};


module.exports = {
  init,
};
