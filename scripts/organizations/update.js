const inq = require('inquirer')

const { constructV4ApiEndpoint } = require('../utils/api/apiHelpers')
const { ORGANIZATIONS_ENDPOINT } = require('../utils/api/endpoints')
const api = require('../utils/api/callApi.js')

const { clientDirectory, readCsv } = require('../utils/helpers/csvHelpers.js')

const questionPrompt = [
  { type: 'input', name: 'orgId', message: 'Enter the orgId for the client', validate: (orgId) => {
    return orgId !== '';
  }},
  { type: 'input', name: 'filename', message: 'What will the filename be? Please include slash. Leave blank for default: "/update_organization.csv"' }
]

const init = (auth, data) => {
  console.log('Work on it')
  // let directory,
  //     filename,
  //     orgId

  // const defaultfilename = 'update_organization.csv'

  // inq.prompt(questionPrompt)
  //   .then(async (answers) => {
  //     filename = (answers.filename == '') ? defaultfilename : answers.filename
  //     directory = clientDirectory(data.company, data.environment, filename) 
  //     const orgs = readCsv(directory)
  //     return (orgs, answers.orgId)
  //   })
  //   .then((orgs, orgId) => {
  //     parseCsv(orgs, orgId)
  //   })
  //   .catch(err => console.log(err))

  //   const parseCsv = (orgs, orgId) => {
  //     orgs.forEach((org, index) => {
  //       let organization = {
  //         "data": {
  //           "type": "organizations",
  //           "id": orgId,
  //         }
  //       }
  //     })
  //   }
}

module.exports = {
  init
}