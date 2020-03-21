const inq = require('inquirer')

const { constructV3ApiEndpoint } = require('../utils/api/apiHelpers.js')
const { GET_STORES_ENDPOINT } = require('../utils/api/endpoints.js')
const api = require('../utils/api/callApi.js')

const { clientDirectory, csvWriter } = require('../utils/helpers/csvHelpers.js')

const questionPrompt = [
  { type: 'input', name: 'apiKey', message: 'Enter a valid API Key', validate: (apiKey) => {
    return apiKey !== '';
  }}
]

// Get Stores from CSV
const init = (data) => {
  let directory,
      apiKey
  
  const defaultfilename = 'stores.csv'
  inq.prompt(questionPrompt)
    .then(async (answers) => {
      filename = defaultfilename
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
          reject(err)
        })
    }

    const formatStores = (strs) => {
      let stores = [];
      let store_services = [];
      strs.forEach(str => {
        let store = {
          'id': str.id,
          'number': str.number,
          'slug': str.slug,
          'service_ids': str.service_ids,
          'feature_ids': str.feature_ids,
          'resourceUri': '/organizations/' + str.organization_nextgen_id + '/locations/' + str.nextgen_id
        }
        str.store_services.forEach(svc => {
          let store_service = {
            'id': svc.id,
            'service_id': svc.service_id,
            'store_id': svc.store_id,
            'resourceUri': '/organizations/' + str.organization_nextgen_id + svc.nextgen_uri
          }
          store_services.push(store_service)
        })
        stores.push(store)
      });

      csvWriter(stores, false, filename, directory)
      csvWriter(store_services, false, 'store_services_for_hours.csv', clientDirectory(data.company, data.environment, 'store_services_for_hours.csv'))
    }
}

module.exports = {
  init,
}