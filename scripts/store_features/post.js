const inq = require('inquirer')
const api = require('../utils/api/callApi.js')
const csv = require('csv-parser')
const fs = require('fs')

const { constructV3ApiEndpoint } = require('../utils/api/apiHelpers')
const { GET_STORES_ENDPOINT } = require('../utils/api/endpoints.js')
const { clientDirectory } = require('../utils/helpers/csvHelpers.js')

const filenameQuestionPrompt = [
  { type: 'input', name: 'apiKey', message: 'Enter a valid API Key', validate: (apiKey) => {
    return apiKey !== '';
  }},
  { type: 'input', name: 'filename', message: 'What will the filename be? Please include slash. Leave blank for default: "/new_features.csv"' }
];

const init = (data) => {
  let directory,
      filename,
      apiKey
  
  let defaultfilename = 'new_features.csv'

  inq.prompt(filenameQuestionPrompt)
    .then(async (answers) => {
      filename = (answers.filename == '') ? defaultfilename : answers.filename;
      directory = clientDirectory(data.company, data.environment, filename)
      apiKey = answers.apiKey
      readCsvFile(directory)
    })
    .catch(err => console.log(err))

    const readCsvFile = (dir) => {
      let features = []
      fs.createReadStream(dir)
        .pipe(csv())
        .on('data', (row) => {
          try {
            features.push(row)
          }
          catch(err) {
            console.log(err)
          }
        })
        .on('end', () => {
          parseCsvData(features)
        })
    }

    const parseCsvData = (ftrs) => {
      ftrs.forEach((ftr, index) => {
        let feature = {
          'id': ftr.store_id,
          'number': ftr.store_number,
          'feature_ids': parseInt(ftr.feature_ids)
        }
        setTimeout(() => {
         getStoreFeatures(feature, index)
        }, index * 1500)
      })
    }

    const getStoreFeatures = (feature) => {
      const endpoint = constructV3ApiEndpoint(data.company, data.environment, GET_STORES_ENDPOINT + '/' + feature.id )
      let settings = {
        url: endpoint,
        method: 'get',
        params: {
          api_key: apiKey
        }
      }
      
      api.call(endpoint, settings).then(res => {
        if(res.store.feature_ids.includes(feature.feature_ids)) {
          return console.log('Skipping')
        }
        const existingFeatures = res.store.feature_ids
        const newFeatures = res.store.feature_ids.concat(feature.feature_ids)
        console.log('Store ID: ' + feature.id)
        postStoreFeatures(newFeatures, existingFeatures, endpoint)
      }).catch(err => {
        console.log(err)
      })      
    }

    const postStoreFeatures = (features, existingFeatures, endpoint) => {
      let settings = {
        url: endpoint,
        method: 'put',
        data: {
          'store': {
            'feature_ids': features
          }
        },
        params: {
          api_key: apiKey
        }
      }
      console.log('Previous: ' + existingFeatures + ' New: ' + features)
      return api.call(endpoint, settings)
    }
}

module.exports = {
  init,
}