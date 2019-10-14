const { constructV3ApiEndpoint } = require('../utils/api/apiHelpers');
const { INDEX_STORE_SERVICE_ENDPOINT } = require('../utils/api/endpoints');
const api = require('../utils/api/callApi.js')

const inq = require('inquirer');

const { clientDirectory, csvWriter } = require('../utils/helpers/csvHelpers');

var filenameQuestionPrompt = [
  { type: 'input', name: 'apiKey', message: 'Enter a valid API key' },
  { type: 'input', name: 'filename', message: 'What will the filename be? Please include slash. Leave blank for default: "/store_services.csv"' }
];

const init = (data) => {
  var directory,
      filename;

  var defaultfilename = 'store_services.csv';

  inq.prompt(filenameQuestionPrompt)
    .then(async (answers) => {
      filename = (answers.filename == '') ? defaultfilename : answers.filename;
      directory = clientDirectory(data.company, data.environment, filename)
      const services = await getStoreServices(answers.apiKey);
      return services
    })
    .then(services => {
      formatServices(services)
    })
    .catch(err => console.log(err));

  const getStoreServices = (apiKey) => {
    const apiEndpoint = constructV3ApiEndpoint(data.company, data.environment, INDEX_STORE_SERVICE_ENDPOINT);

    let settings = {
      url: apiEndpoint,
      method: 'get',
      params: {
        api_key: apiKey
      }
    }

    return api.call(apiEndpoint, settings)
  }

  const formatServices = (svcs) => {
    let services = []
    svcs.store_services.forEach(svc => {
      let service = {
        'id': svc.id,
        'service_id': svc.service_id,
        'appointments_enabled': svc.appointments_enabled,
        'associate_required': svc.associate_required,
        'private': svc.private,
        'hidden_from_reporting': svc.hidden_from_reporting,
        'book_with': svc.book_with,
        'auto_confirm_appt_requests': svc.auto_confirm_appt_requests,
        'required_lead_time': svc.required_lead_time
      }
      services.push(service)
    })
    csvWriter(services, false, filename, directory)
  }
};


module.exports = {
  init,
};
