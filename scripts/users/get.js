const inq = require('inquirer')
const csv = require('csv-writer').createObjectCsvWriter

const { constructV3ApiEndpoint } = require('../utils/api/apiHelpers.js')
const { GET_USERS_ENDPOINT } = require('../utils/api/endpoints.js')
const api = require('../utils/api/callApi.js')

const { clientDirectory, createHeaders } = require('../utils/helpers/csvHelpers.js')

const questionPrompt = [
  { type: 'input', name: 'apiKey', message: 'Enter a valid API Key', validate: (apiKey) => {
    return apiKey !== '';
  }},
  { type: 'input', name: 'filename', message: 'What will the filename be? Please include slash. Leave blank for default: "/users.csv"' }
]

// Get Stores from CSV
const init = (data) => {
  let directory,
      filename,
      apiKey
  
  const defaultfilename = 'users.csv'

  inq.prompt(questionPrompt)
    .then(async (answers) => {
      filename = (answers.filename == '') ? defaultfilename : answers.filename
      directory = clientDirectory(data.company, data.environment, filename)
      const endpoint = constructV3ApiEndpoint(data.company, data.environment, GET_USERS_ENDPOINT)
      apiKey = answers.apiKey
      new Promise((resolve, reject) => {
        getAllUsers(apiKey, endpoint, [], resolve, reject)
      })
      .then(response => {
        formatUsers(response)
      })
    })
    .catch(err => console.log(err))

    const getAllUsers = (apiKey, endpoint, users, resolve, reject) => {
      let settings = {
        url: endpoint,
        method: 'get',
        params: {
          api_key: apiKey,
        }
      }

      api.call(endpoint, settings)
        .then(res => {
          let allUsers = users.concat(res.users)
          if (res.meta.links.next !== null) {
            getAllUsers(apiKey, res.meta.links.next, allUsers, resolve, reject)
          } else {
            resolve(allUsers)
          }
        })
        .catch(err => {
          console.log(err)
          reject('There was a problem')
        })
    }

    const formatUsers = (usrs) => {
      let users = [];
      usrs.forEach(usr => {
        let user = {
          'id': usr.id,
          'store_id': usr.store_id,
          'first_name': usr.first_name,
          'last_name': usr.last_name,
          'role': usr.role,
          'email': usr.email,
        }
        users.push(user)
      });

      printToCSV(users)
    }

    const printToCSV = (data) => {
      const keys = createHeaders(data)

      const csvWriter = csv({
        header: keys,
        append: false,
        path: directory
      })
      csvWriter.writeRecords(data).then(() => console.log(filename + ' successfully written to ' + directory))
    }
}

module.exports = {
  init,
}