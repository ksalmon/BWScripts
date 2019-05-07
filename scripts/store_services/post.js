// const { constructApiRoot, constructV3ApiEndpoint } = require('./utils/apiHelpers');
// const { LOCALE_ENDPOINT } = require('./utils/endpoints');
// const api = require('./utils/callApi.js')

const inq = require('inquirer');

const { clientDirectory } = require('../utils/helpers/csvHelpers');
const csv = require('csv-parser')
const fs = require('fs')
const mkdirp = require('mkdirp');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;  


var filenameQuestionPrompt = [
  { type: 'password', name: 'api_key', message: 'Enter a valid API Key' },
  { type: 'input', name: 'filename', message: 'What will the filename be? Please include slash. Leave blank for default: "/store_services.csv"' }
];
// Create Store Services from CSV
const init = (data) => {
  var directory,
      filename;

  var defaultfilename = '/store_services.csv';

  inq.prompt(filenameQuestionPrompt)
    .then(async (answers) => {
      filename = (answers.filename == '') ? defaultfilename : answers.filename;
      directory = clientDirectory(data.company, data.enviroment, filename)
      readCsvFile(directory)
    })
    .catch(e => console.log(e));

  const readCsvFile = (dir) => {
    var storeServices = [];
    fs.createReadStream(dir)
      .pipe(csv())
      .on('data', function(row){
        try {
          storeServices.push(row)
        }
        catch(err) {
          console.log(err)
        }
      })
      .on('end',function(){
        parseCsvData(storeServices)
      });
  };

  const parseCsvData = (svc) => {
    svc.forEach((usvc, index) => {
      let service = {
        'type': 'service',
        'store_id': usvc.store_id,
        'attributes': {
          'is_store_number': usvc.is_store_number,
          'service_id': usvc.service_id,
          'appointments_enabled': usvc.appointments_enabled,
          'associate_required': usvc.associate_required
        }
      }

      setTimeout(function(){
        postService({data: service});
      }, index * 1000)
    })
  };

  const postService = (svc) => {
    console.log(svc)
  }
}

module.exports = {
  init,
}