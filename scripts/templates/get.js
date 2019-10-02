const inq = require('inquirer')
const csv = require('csv-writer').createObjectCsvWriter

const { constructV4ApiEndpoint } = require('../utils/api/apiHelpers.js')
const { TEMPLATES_ENDPOINT } = require('../utils/api/endpoints.js')
const api = require('../utils/api/callApi.js')

const { clientDirectory } = require('../utils/helpers/csvHelpers.js')

const questionPrompt = [
  { type: 'input', name: 'filename', message: 'What will the filename be? Please include slash. Leave blank for default: "/templates.csv"' }
]

const init = (auth, data) => {
  let directory,
      filename

  const defaultfilename = 'templates.csv'

  inq.prompt(questionPrompt)
    .then(async (answers) => {
      filename = (answers.filename == '') ? defaultfilename : answers.filename
      directory = clientDirectory(data.company, data.environment, filename)
      const templates = await getTemplates(auth)
      return templates
    })
    .then(templates => {
      formatTemplates(templates)
    })
    .catch(err => console.log(err))

    const getTemplates = (auth) => {
      const apiEndpoint = constructV4ApiEndpoint(data.environment, TEMPLATES_ENDPOINT)
      let settings = {
        url: apiEndpoint,
        method: 'get',
        headers: { 'Authorization' : 'Bearer ' + auth.token },
        params: {
          perPage: 999
        }
      }
      return api.call(apiEndpoint, settings)
    }

    const formatTemplates = (tmps) => {
      let templates = [];
      let formatted = [];
      tmps.data.forEach(tmp => {
        let template = {
          "id": tmp.id,
          "name": tmp.attributes.name,
          "subjectKey": tmp.attributes.subjectTranslationKey,
          "bodyKey": tmp.attributes.bodyTranslationKey,
          "resourceUri": !tmp.relationships.organization ? 'Default Template' : '/organizations/' + tmp.relationships.organization.data.id + '/templates/' + tmp.id
        }
        let format = {
          "locale": '',
          "key": '',
          'value': '',
          "resourceUri": !tmp.relationships.organization ? 'Default Template' : '/organizations/' + tmp.relationships.organization.data.id + '/templates/' + tmp.id,
          "name": tmp.attributes.name,
        }
        templates.push(template)
        formatted.push(format)
      })
      printToCSV(templates, formatted)
    }

    const printToCSV = (templates, formatted) => {
      let templateKeys = []
      let formattedKeys = []

      Object.keys(templates[0]).forEach(x => {
        templateKeys.push({id: x, title: x})
      });


      Object.keys(formatted[0]).forEach(x => {
        formattedKeys.push({id: x, title: x})
      });

      const writeGet = csv({
        header: templateKeys,
        append: false,
        path: directory
      })

      const writeFormatted = csv({
        header: formattedKeys,
        append: false,
        path: clientDirectory(data.company, data.environment, 'formatted_templates.csv')
      })

      writeGet.writeRecords(templates).then(() => console.log(filename + ' Written to ' + directory))
      writeFormatted.writeRecords(formatted).then(() => console.log('CSV Template Written'))
    }
}

module.exports = {
  init,
}