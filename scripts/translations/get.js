const inq = require('inquirer')
const csv = require('csv-writer').createObjectCsvWriter

const { constructV4ApiEndpoint } = require('../utils/api/apiHelpers')
const { TRANSLATIONS_ENDPOINT } = require('../utils/api/endpoints')
const api = require('../utils/api/callApi.js')

const { clientDirectory, createHeaders } = require('../utils/helpers/csvHelpers.js')

const questionPrompt = [
  { type: 'input', name: 'filename', message: 'What will the filename be? Please include slash. Leave blank for default: "/translations.csv"' }
]

const init = (auth, data) => {
  let directory,
      filename,
      endpoint

  const defaultfilename = 'translations.csv'
  inq.prompt(questionPrompt)
    .then(async (answers) => {
      filename = (answers.filename == '') ? defaultfilename : answers.filename
      directory = clientDirectory(data.company, data.environment, filename)
      endpoint = constructV4ApiEndpoint(data.environment, TRANSLATIONS_ENDPOINT)
      new Promise((resolve, reject) => {
        getAllTranslations(endpoint, [], resolve, reject)
      })
      .then(response => {
        formatTranslations(response)
      })
      .catch(err => console.log(err))
    })
    .catch(err => console.log(err))

    const getAllTranslations = (endpoint, translations, resolve, reject) => {
      let settings = {
        url: endpoint,
        method: 'get',
        headers: { 'Authorization' : 'Bearer ' + auth.token }
      }
      
      api.call(endpoint, settings)
        .then(res => {
          let allTranslations = translations.concat(res.data)
          if (res.links.next) {
            getAllTranslations(res.links.next, allTranslations, resolve, reject)
          } else {
            resolve(allTranslations)
          }
        })
        .catch(err => {
          reject(err)
        })
    }

    const formatTranslations = (trns) => {
      let translations = [];
      trns.forEach(trn => {
        let translation = {
          'type': trn.type,
          'id': trn.id,
          'locale': trn.attributes.locale,
          'key': trn.attributes.key,
          'value': trn.attributes.value,
          'resourceUri': trn.attributes.resourceUri
        }
        translations.push(translation)
      })
      printToCSV(translations)
    }

    const printToCSV = (data) => {
      let keys = createHeaders(data)

      const csvWriter = csv({
        header: keys,
        append: false,
        path: directory
      })
      csvWriter.writeRecords(data).then(() => console.log('Done'))
    }
}

module.exports = {
  init,
}