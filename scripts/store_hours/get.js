const inq = require('inquirer')

const { constructV4ApiEndpoint } = require('../utils/api/apiHelpers')
const { HOURS_ENDPOINT } = require('../utils/api/endpoints')
const api = require('../utils/api/callApi')
const getStores = require('../stores/get')

const { clientDirectory, csvWriter } = require('../utils/helpers/csvHelpers')

const questionPrompt = [
  { type: 'input', name: 'filename', message: 'What will the filename be? Please include slash. Leave blank for default: "/store_hours.csv"' }
]

const init = (auth, data) => {
  let directory,
      filename
    
  const defaultfilename = 'store_hours.csv'
  getStores(data)
}

module.exports = {
  init,
}