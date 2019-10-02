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
      filename

  const defaultfilename = 'translations.csv'
  inq.prompt(questionPrompt)
    .then(async (answers) => {
      filename = (answers.filename == '') ? defaultfilename : answers.filename
      directory = clientDirectory(data.company, data.environment, filename)
      const translations =  await getTranslations(auth)
      return translations
    })
    .then(translations => {
      formatTranslations(translations)
    })
    .catch(err => console.log(err))

    const getTranslations = (auth) => {
      const apiEndpoint = constructV4ApiEndpoint(data.environment, TRANSLATIONS_ENDPOINT)
      let settings = {
        url: apiEndpoint,
        method: 'get',
        headers: { 'Authorization' : 'Bearer ' + auth.token }
      }
      return api.call(apiEndpoint, settings)
    }

    const formatTranslations = (trns) => {
      let translations = [];
      trns.data.forEach(trn => {
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