const inq = require('inquirer')

const { constructV4ApiEndpoint } = require('../utils/api/apiHelpers')
const { ORGANIZATIONS_ENDPOINT } = require('../utils/api/endpoints')
const api = require('../utils/api/callApi.js')

const { clientDirectory, csvWriter } = require('../utils/helpers/csvHelpers.js')

const questionPrompt = [
  { type: 'input', name: 'orgId', message: 'Enter the orgId for the client', validate: (orgId) => {
    return orgId !== '';
  }},
  { type: 'input', name: 'filename', message: 'What will the filename be? Please include slash. Leave blank for default: "/organization.csv"' }
]

const init = (auth, data) => {
  let directory,
      filename

  const defaultfilename = 'organization.csv'
  inq.prompt(questionPrompt)
    .then(async (answers) => {
      filename = (answers.filename == '') ? defaultfilename : answers.filename
      directory = clientDirectory(data.company, data.environment, filename)
      const organization = getOrganization(answers.orgId)
      return organization
    })
    .then(organization => {
      formatOrganization(organization)
    })
    .catch(err => console.log(err))

    const getOrganization = (orgId) => {
      const endpoint = constructV4ApiEndpoint(data.environment, ORGANIZATIONS_ENDPOINT(orgId))

      let settings = {
        url: endpoint,
        method: 'get',
        headers: { 'Authorization' : 'Bearer ' + auth.token }
      }

      return api.call(endpoint, settings)
    }

    const formatOrganization = (orgs) => {
      let org = [{
        'id': orgs.data.id,
        'name': !orgs.data.attributes.name ? 'null' : orgs.data.attributes.name,
        'apiRoot': !orgs.data.attributes.apiRoot ? 'null' : orgs.data.attributes.apiRoot,
        'companyUrl': !orgs.data.attributes.companyUrl ? 'null' : orgs.data.attributes.companyUrl,
        'consumerBasePath': !orgs.data.attributes.consumerBasePath ? 'null' : orgs.data.attributes.consumerBasePath,
        'defaultMapLocation': !orgs.data.attributes.defaultMapLocation ? 'null' : orgs.data.attributes.defaultMapLocation,
        'defaultLocale': !orgs.data.relationships.defaultLocale ? 'null' : orgs.data.relationships.defaultLocale,
        'localePath': !orgs.data.attributes.localePath ? 'null' : orgs.data.attributes.localePath,
      }]
      csvWriter(org, false, filename, directory)
    }
}

module.exports = {
  init,
}