const { constructV3ApiEndpoint } = require('../utils/api/apiHelpers.js');

const { UPDATE_STORE_SERVICE_ENDPOINT } = require('../utils/api/endpoints.js')
const api = require('../utils/api/callApi.js')

const inq = require('inquirer');

const { clientDirectory } = require('../utils/helpers/csvHelpers');
const csv = require('csv-parser')
const fs = require('fs')


const filenameQuestionPrompt = [
  { type: 'password', name: 'apiKey', message: 'Enter a valid API Key' },
  { type: 'input', name: 'filename', message: 'What will the filename be? Please include slash. Leave blank for default: "/store_services.csv"' }
];
// Update Store Services from CSV
const init = (data) => {
  var directory,
      filename,
      apiKey,
      bool

  var defaultfilename = '/store_services.csv';

  inq.prompt(filenameQuestionPrompt)
    .then(async (answers) => {
      filename = (answers.filename == '') ? defaultfilename : answers.filename;
      directory = clientDirectory(data.company, data.environment, filename)
      apiKey = answers.apiKey
      readCsvFile(directory)
    })
    .catch(err => console.log(err));

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
        'store_id': parseInt(usvc.store_id),
        'id': parseInt(usvc.store_service_id),
        'data': {
          'store_service': {
            'service_id': parseInt(usvc.service_id),
            'appointments_enabled': bool = (usvc.appointments_enabled == "true"),
            'associate_required': bool = (usvc.associate_required == "true"), 
          }
        }
      }

      setTimeout(function(){
        postService(service, usvc.is_store_number);
      }, index * 1000)
    })
  };

  const postService = (svc, isStoreNumber) => {
    bool = (isStoreNumber == "true")
    const apiEndpoint = constructV3ApiEndpoint(data.company, data.environment, UPDATE_STORE_SERVICE_ENDPOINT(svc.store_id, svc.id))
    let settings = {
      method: 'put',
      data: svc.data,
      params: {
        api_key: apiKey,
        ...bool ? {store_number: true} : {},
      }
    }

    return api.call(apiEndpoint, settings)
  }
}

module.exports = {
  init,
}