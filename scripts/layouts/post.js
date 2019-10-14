const inq = require('inquirer')
const api = require('../utils//api/callApi')
const csv = require('csv-parser')
const fs = require('fs')
const writeCsv = require('csv-writer').createObjectCsvWriter; 

const { constructV4ApiEndpoint } = require('../utils/api/apiHelpers')
const { LAYOUTS_ENDPOINT } = require('../utils/api/endpoints')
const { clientDirectory, csvWriter } = require('../utils/helpers/csvHelpers')

const filenameQuestionPrompt = [
  { type: 'input', name: 'filename', message: 'What will the filename be? Please include slash. Leave blank for default: "/new_layouts.csv"' }
];

const init = (auth, data) => {
  let directory,
      filename
  
    let defaultfilename = 'new_layouts.csv'

    inq.prompt(filenameQuestionPrompt)
      .then(async (answers) => {
        filename = (answers.filename == '') ? defaultfilename : answers.filename;
        directory = clientDirectory(data.company, data.environment, filename)
        readCsvFile(directory)
      })
      .catch(err => console.log(err))

      const readCsvFile = (dir) => {
        let layouts = []
        fs.createReadStream(dir)
          .pipe(csv())
          .on('data', (row) => {
            try {
              layouts.push(row)
            }
            catch(err) {
              console.log(err)
            }
          })
          .on('end', () => {
            parseCsvData(layouts)
          }) 
      }

      const parseCsvData = (lyts) => {
        lyts.forEach((lyt, index) => {
          let layout = {
            "data": {
              "type": "layouts",
              "attributes": {
                "comment": data.company + " layout for " + lyt.localeId + " -- Time: " + Date.now(),
                "headHtml": lyt.headHtml,
                "headerHtml": lyt.headerHtml,
                "footerHtml": lyt.footerHtml
              },
              "relationships": {
                "locale": {
                  "data": {
                    "type": "locales",
                    "id": lyt.localeId
                  }
                }
              }
            }
          }
          setTimeout(() => {
            createLayout(layout)
          }, index * 1000)
        })
      }

      const createLayout = (layout) => {
        const apiEndpoint = constructV4ApiEndpoint(data.environment, LAYOUTS_ENDPOINT)

        let settings = {
          url: apiEndpoint,
          method: 'post',
          headers: { 'Authorization': 'Bearer ' + auth.token, },
          data: layout
        }

        api.call(apiEndpoint, settings)
          .then(response => {
            let locale = [{
              'locale': layout.localeId,
              'layoutId': response.data.id
            }]
            csvWriter(locale, false, 'layoutIds.csv', clientDirectory(data.company, data.environment, 'layoutIds.csv'))
          })
          .catch(err => {
            console.log(err)
          })
      }

      const printToCsv = (locale) => {
        const csvWriter = writeCsv({
          header: [
            {id: 'locale', title: 'locale'},
            {id: 'layoutId', title: 'layoutId'}
          ],
          append: true,
          path: clientDirectory(data.company, data.environment, 'layoutIds.csv')
        });
        csvWriter.writeRecords(locale).then(() => console.log('CSV Written'))
      }
    }

    module.exports = {
      init,
    }