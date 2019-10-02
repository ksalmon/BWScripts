const inq = require('inquirer')
const api = require('../utils/api/callApi.js')
const csv = require('csv-parser')
const fs = require('fs')

const { TRANSLATIONS_ENDPOINT } = require('../utils/api/endpoints.js')
const { constructV4ApiEndpoint } = require('../utils/api/apiHelpers')
const { clientDirectory } = require('../utils/helpers/csvHelpers.js')

var filenameQuestionPrompt = [
  { type: 'input', name: 'filename', message: 'What will the filename be? Please include slash. Leave blank for default: "/updated_translations.csv"' }
];

const init = (auth, data) => {
  let directory,
      filename
  
  let defaultfilename = 'updated_translations.csv'

  inq.prompt(filenameQuestionPrompt)
    .then(async(answers) => {
      filename = (answers.filename == '') ? defaultfilename : answers.filename;
      directory = clientDirectory(data.company, data.environment, filename)
      readCsvFile(directory)
    })
    .catch (err => console.log(err))

    const readCsvFile = (dir) => {
      let translations = []
      fs.createReadStream(dir)
        .pipe(csv())
        .on('data', (row) => {
          try {
            translations.push(row)
          }
          catch(err) {
            console.log(err)
          }
        })
        .on('end', () => {
          parseCsvData(translations)
        })
    }

    const parseCsvData = (trns) => {
      trns.forEach((trn, index) => {
        let translation = {
          'id': trn.id,
          'data': {
            'type': 'translations',
            'attributes': {
              'value': trn.value,
            }
          }
        }

        setTimeout(() => {
          postTranslation(translation)
        }, index * 1000)
      })
    }

    const postTranslation = (trn) => {
      console.log(trn)
      const apiEndpoint = constructV4ApiEndpoint(data.environment, TRANSLATIONS_ENDPOINT + trn.id)
      let settings = {
        method: 'patch',
        data: trn,
        headers: { 'Authorization': 'Bearer ' + auth.token, },
      }

      return api.call(apiEndpoint, settings)
    }
}

module.exports = {
  init,
}