const inq = require('inquirer')
const api = require('../utils/api/callApi')

const { constructV4ApiEndpoint } = require('../utils/api/apiHelpers')
const { LOCALE_ENDPOINT } = require('../utils/api/endpoints')
const { clientDirectory, csvWriter } = require('../utils/helpers/csvHelpers')

let filenameQuestionPrompt = [
  { type: 'input', name: 'filename', message: 'What will the filename be? Please include slash. Leave blank for default: "/locales.csv"' }
];

const init = (auth ,data) => {
  let directory,
      filename,
      endpoint

  const defaultfilename = 'locales.csv'

  inq.prompt(filenameQuestionPrompt)
    .then(async (answers) => {
      filename = (answers.filename == '') ? defaultfilename : answers.filename;
      directory = clientDirectory(data.company, data.environment, filename)
      endpoint = constructV4ApiEndpoint(data.environment, LOCALE_ENDPOINT)
      new Promise((resolve, reject) => {
        getAllLocales(endpoint, [], resolve, reject)
      })
      .then(response => {
        formatLocales(response)
      })
      .catch(err => console.log(err))
    })
    .catch(err => console.log(err))

    const getAllLocales = (endpoint, locales, resolve, reject) => {
      let settings = {
        url: endpoint,
        method: 'get',
        headers: { 'Authorization' : 'Bearer ' + auth.token }
      }

      api.call(endpoint, settings)
        .then(res => {
          let allLocales = locales.concat(res.data)
          if (res.links.next) {
            getAllLocales(res.links.next, allLocales, resolve, reject)
          } else {
            resolve(allLocales)
          }
        })
        .catch(err => {
          reject(err)
        })
    }

    const formatLocales = (lcls) => {
      let locales = []
      lcls.forEach(lcl => {
        let locale = {
          'id': lcl.id,
          'supported': lcl.attributes.supported,
          'custom': lcl.attributes.custom,
          'reactMapping': lcl.attributes.reactMapping,
          'momentMapping': lcl.attributes.momentMapping,
          'legacyMapping': lcl.attributes.legacyMapping
        }
        locales.push(locale)
      })
      csvWriter(locales, false, filename, directory)
    }
}

module.exports = {
  init,
}