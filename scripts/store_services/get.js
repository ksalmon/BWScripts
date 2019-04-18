const { constructApiRoot, constructV3ApiEndpoint } = require('../utils/apiHelpers');
const { INDEX_STORE_SERVICE_ENDPOINT } = require('../utils/endpoints');
const api = require('../utils/callApi.js')

const inq = require('inquirer');

const { clientDirectory } = require('../utils/csvHelpers');
const csv = require('csv-parser')
const fs = require('fs')
const mkdirp = require('mkdirp');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;  

var filenameQuestionPrompt = [
  { type: 'input', name: 'apiKey', message: 'Enter a valid API key' },
  { type: 'input', name: 'filename', message: 'What will the filename be? Please include slash. Leave blank for default: "/store_services.csv"' }
];

const init = (auth, data) => {
  var directory,
      filename;

  var defaultfilename = '/store_services.csv';

  inq.prompt(filenameQuestionPrompt)
    .then(async (answers) => {
      filename = (answers.filename == '') ? defaultfilename : answers.filename;
      directory = clientDirectory(data.company, data.enviroment)
      const services = await getStoreServices(answers.apiKey);
      return services
    })
    .then(services => {
      formatServices(services)
    })
    .catch(e => console.log(e));

  const getStoreServices = (apiKey) => {
    const apiEndpoint = constructV3ApiEndpoint(data.company, data.enviroment, INDEX_STORE_SERVICE_ENDPOINT, apiKey );

    let settings = {
      url: apiEndpoint,
      method: 'get',
    }

    return api.call(apiEndpoint, settings)
  }

  const formatServices = (svc) => {
    let services = [];
    svc.store_services.forEach(slc => {
      // let service = JSON.stringify(slc)
      services.push(slc)
    });
    mkdirp(directory, function(err) { 
      printToCSV(services);
    });
  }

  const printToCSV = (data) => {
    let keys = []
    // BUG: This does not find nested keys
    Object.keys(data[0]).forEach(x => {
      keys.push({id: x, title: x})
    });
    const csvWriter = createCsvWriter({
      header: keys,
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
