const inq = require('inquirer')
const csv = require('csv-writer').createObjectCsvWriter

const { constructV4ApiEndpoint } = require('../utils/api/apiHelpers')
const { HOURS_ENDPOINT } = require('../utils/api/endpoints')
const api = require('../utils/api/callApi.js')

const { clientDirectory, createHeaders } = require('../utils/helpers/csvHelpers.js')

const questionPrompt = [
  { type: 'input', name: 'filename', message: 'What will the filename be? Please include slash. Leave blank for default: "/hours.csv"' }
]

const init = (auth, data) => {
  let directory,
      filename
  
  const defaultfilename = 'hours.csv'
  inq.prompt(questionPrompt)
    .then(async (answers) => {
      filename = (answers.filename == '') ? defaultfilename : answers.filename
      directory = clientDirectory(data.company, data.environment, filename)
      const endpoint = constructV4ApiEndpoint(data.environment, HOURS_ENDPOINT)
      new Promise((resolve, reject) => {
        getHours(auth, endpoint, [], resolve, reject)
      })
      .then(hours => {
        formatHours(hours)
      })
    })
    .catch(err => console.log(err))

    const getHours = (auth, endpoint, hours, resolve, reject) => {

      let settings = {
        url: endpoint,
        method: 'get',
        headers: { 'Authorization' : 'Bearer ' + auth.token }
      }

       api.call(endpoint, settings)
        .then(res => {
          let allHours = hours.concat(res.data)
          if (res.links.next !== null) {
            setTimeout(() => {
              getHours(auth, res.links.next, allHours, resolve, reject)
              console.log(res.links.next)
            }, 1000)
          } else {
            resolve(allHours)
          }
        })
        .catch(err => {
          console.log(err)
          reject(err)
        })
    }

    const formatHours = (hrs) => {
      let hours = []
      hrs.forEach(hr => {
        let hour = {
          'id': hr.id,
          'dayOfWeek': hr.attributes.dayOfWeek,
          'startTime': hr.attributes.startTime,
          'endTime': hr.attributes.endTime,
          'timeZone': hr.attributes.timeZone,
          'available': hr.attributes.available,
          'resourceUri': hr.attributes.resourceUri
        }
        hours.push(hour)
      })
      printToCSV(hours)
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