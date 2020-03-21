const inq = require('inquirer')

const { constructV4ApiEndpoint } = require('../utils/api/apiHelpers')
const { HOURS_ENDPOINT } = require('../utils/api/endpoints')
const api = require('../utils/api/callApi.js')
const getStores = require('../stores/get')

const { clientDirectory, csvWriter, readCsv } = require('../utils/helpers/csvHelpers.js')

const questionPrompt = [
  { type: 'input', name: 'filename', message: 'What will the filename be? Please include slash. Leave blank for default: "/service_hours.csv"' }
]

const init = (auth, data) => {
  let directory,
      filename

  const defaultfilename = 'service_hours.csv'
  inq.prompt(questionPrompt)
    .then(async (answers) => {
      filename = (answers.filename == '') ? defaultfilename : answers.filename;
      directory = clientDirectory(data.company, data.environment, filename)
      console.log('Retreiving ')
      getStores(data)
      const hours_uris = readCsv(data.company, data.environment, 'store_services_for_hours.csv')
    })
}