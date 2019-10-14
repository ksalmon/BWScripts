const inq = require('inquirer')
const csv = require('csv-writer').createObjectCsvWriter

const { constructV4ApiEndpoint } = require('../utils/api/apiHelpers')
const { LAYOUTS_ENDPOINT } = require('../utils/api/endpoints')
const api = require('../utils/api/callApi.js')

const { clientDirectory, createHeaders } = require('../utils/helpers/csvHelpers.js')

const questionPrompt = [
  { type: 'input', name: 'filename', message: 'What will the filename be? Please include slash. Leave blank for default: "/layouts.csv"' }
]

const init = (auth, data) => {
  let directory,
      filename,
      endpoint

  const defaultfilename = 'layouts.csv'
  inq.prompt(questionPrompt)
    .then(async (answers) => {
      filename = (answers.filename == '') ? defaultfilename : answers.filename
      directory = clientDirectory(data.company, data.environment, filename)
      endpoint = constructV4ApiEndpoint(data.environment, LAYOUTS_ENDPOINT)
      new Promise((resolve, reject) => {
        getAllLayouts(endpoint, [], resolve, reject)
      })
      .then(response => {
        formatLayouts(response)
      })
      .catch(err => console.log(err))
    })
    .catch(err => console.log(err))

    const getAllLayouts = (endpoint, layouts, resolve, reject) => {
      let settings = {
        url: endpoint,
        method: 'get',
        headers: { 'Authorization' : 'Bearer ' + auth.token }
      }
      
      api.call(endpoint, settings)
        .then(res => {
          let allLayouts = layouts.concat(res.data)
          if (res.links.next) {
            getAllLayouts(res.links.next, allLayouts, resolve, reject)
          } else {
            resolve(allLayouts)
          }
        })
        .catch(err => {
          reject(err)
        })
    }

    const formatLayouts = (trns) => {
      let layouts = [];
      trns.forEach(trn => {
        let layout = {
          'id': trn.id,
          'comment': trn.attributes.comment,
          'html': trn.attributes.headHtml + trn.attributes.headerHtml + trn.attributes.footerHtml,
          'locale': trn.relationships.locale.data.id
        }
        layouts.push(layout)
      })
      printToCSV(layouts)
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