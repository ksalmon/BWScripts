const inq = require('inquirer')
const csv = require('csv-writer').createObjectCsvWriter

const { constructV3ApiEndpoint } = require('../utils/api/apiHelpers.js')
const { GET_STORES_ENDPOINT } = require('../utils/api/endpoints.js')
const api = require('../utils/api/callApi.js')

const { clientDirectory, createHeaders } = require('../utils/helpers/csvHelpers.js')

const questionPrompt = [
  { type: 'input', name: 'apiKey', message: 'Enter a valid API Key', validate: (apiKey) => {
    return apiKey !== '';
  }},
  { type: 'input', name: 'filename', message: 'What will the filename be? Please include slash. Leave blank for default: "/stores.csv"' }
]

// Get Stores from CSV
const init = (data) => {
  let directory,
      filename,
      apiKey
  
  const defaultfilename = 'stores.csv'
  inq.prompt(questionPrompt)
    .then(async (answers) => {
      filename = (answers.filename == '') ? defaultfilename : answers.filename
      directory = clientDirectory(data.company, data.environment, filename)
      const endpoint = constructV3ApiEndpoint(data.company, data.environment, GET_STORES_ENDPOINT)
      apiKey = answers.apiKey
      new Promise((resolve, reject) => {
        getAllStores(apiKey, endpoint, [], resolve, reject)
      })
      .then(response => {
        formatStores(response)
      })
    })
    .catch(err => console.log(err))

    const getAllStores = (apiKey, endpoint, stores, resolve, reject) => {
      let settings = {
        url: endpoint,
        method: 'get',
        params: {
          api_key: apiKey,
        }
      }

      api.call(endpoint, settings)
        .then(res => {
          let allStores = stores.concat(res.stores)
          if (res.meta.links.next !== null) {
            getAllStores(apiKey, res.meta.links.next, allStores, resolve, reject)
          } else {
            resolve(allStores)
          }
        })
        .catch(err => {
          console.log(err)
          reject('There was a problem')
        })
    }

    const formatStores = (strs) => {
      let stores = [];
      strs.forEach(str => {
        let store = {
          'id': str.id,
          'number': str.number,
          'slug': str.slug,
          'email': str.email,
          'phone_number': str.phone_number,
          'service_ids': str.service_ids,
          'feature_ids': str.feature_ids,
        }
        stores.push(store)
      });

      printToCSV(stores)
    }

    const printToCSV = (strs) => {
      const keys = createHeaders(strs)

      const csvWriter = csv({
        header: keys,
        append: false,
        path: directory
      })
      csvWriter.writeRecords(strs).then(() => console.log(filename + ' successfully written to ' + directory))
    }
}

module.exports = {
  init,
}