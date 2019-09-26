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
          'id': ftr.storeId,
          'number': ftr.storeNumber,
          'feature_ids': parseInt(ftr.featureIds)
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
        const newFeatures = res.store.feature_ids.concat(feature.feature_ids)
        postStoreFeatures(newFeatures, endpoint)
      }).catch(err => {
        console.log(err)
      })      
    }

    const postStoreFeatures = (features, endpoint) => {
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

      return api.call(endpoint, settings)
    }
}

module.exports = {
  init,
}

// require('es6-promise').polyfill();
// require('isomorphic-fetch');

// const moment = require('moment');
// const csv = require('csv-parser')
// const fs = require('fs')

// const args = process.argv.slice(2)
// if (args.length < 2) {
//   console.log("Please pass both company slug and envo!")
//   process.exit()
// }

// const company = args[0];
// const envo =  args[1];
// const dir = '../data/' + company + '/' + envo

// const apiEndpoint = constructFetchUrl(args)

// function constructFetchUrl(args) {
//   let fetchUrl = ''
//   fetchUrl += 'https://' + company
//   if (envo !== 'production') {
//     fetchUrl += '-' + envo 
//   } 
//   fetchUrl += '.brickworksoftware.com'
//   return fetchUrl
// }

// var storeFeatures = []
// fs.createReadStream(dir + '/store_features.csv')
//   .pipe(csv())
//   .on('data', function(data){
//     storeFeatures.push(data)
//   })
//   .on('end',function() {
//     mapStoreFeatures(storeFeatures)
//   });



// function mapStoreFeatures(data) {
//   data.forEach((store, index) => {
//     if (!store.feature_ids) { return } 
//     setTimeout(function(){
//       postToV3(store.number, store.feature_ids);
//       console.log(index)
//     }, index * 1000);
//   });
// }


// async function postToV3(store_number, features) {
//   let storeEndpoint = apiEndpoint + "/api/v3/admin/stores/" + store_number + "/?store_number=true&api_key="
//   let parsedFeatures = JSON.parse(features);

//   let settings = {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json', },
//     body: JSON.stringify({"store":{"feature_ids": parsedFeatures}})
//   }

//   try {
//     let response = await fetch(storeEndpoint, settings)
//     console.log("Posting Features to " + store_number);
//   }
//   catch(e) {
//    console.log('Error!', e);
//   }
// }


