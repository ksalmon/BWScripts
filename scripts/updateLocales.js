const { constructApiRoot, constructV4ApiEndpoint } = require('./utils/apiHelpers');
const { LOCALE_ENDPOINT } = require('./utils/endpoints');
const api = require('./utils/callApi.js')

const inq = require('inquirer');

const { clientDirectory } = require('./utils/csvHelpers');
const csv = require('csv-parser')
const fs = require('fs')

var filenameQuestionPrompt = [
  { type: 'input', name: 'filename', message: 'What is the filename in the client directory? Please include slash. Leave blank for default: "/update-locales.csv"' }
];

const init = (auth, data) => {
  var directory,
      filename;
  var defaultfilename = '/update-locales.csv'
  inq.prompt(filenameQuestionPrompt)
    .then(answer => {
      filename = (answer.filename == '') ? defaultfilename : answer.filename;
      directory = clientDirectory(data.company, data.enviroment, filename)
      readCsvFile(directory)
    });

  const readCsvFile = (dir) => {
    var locales = [];
    fs.createReadStream(dir)
      .pipe(csv())
      .on('data', function(row){
        try {
          locales.push(row)
        }
        catch(err) {
          console.log(err)
        }
      })
      .on('end',function(){
        parseCsvData(locales)
      });
  };

  const parseCsvData = (lc) => {
    lc.forEach((ulc, index) => {
      let locale = {
        "type": 'locale',
        "id": ulc.id,
        "attributes": {
          "supported": true,
          "reactMapping": ulc.reactMapping,
          "momentMapping": ulc.momentMapping,
          "legacyMapping": ulc.legacyMapping,
        },
        "relationships": {},
      }

      if (ulc.layoutId) {
        let liveLayout = {
          "liveLayout": {
            "data": {
              "type": "layouts",
              "id": ulc.layoutId
            }
          }
        }
        locale.relationships = liveLayout
      }

      setTimeout(function(){
        postLocale({data: locale});
      }, index * 1000);
    })  
  };

  const postLocale = (lc) => {
    const localePath = LOCALE_ENDPOINT + "/" + lc.data.id.replace("/", "%2F");
    const apiEndpoint = constructV4ApiEndpoint(data.enviroment, localePath );

    let settings = {
      url: apiEndpoint,
      method: 'patch',
      headers: { 'Authorization': 'Bearer ' + auth.token, },
      data: lc,
    }

    return api.call(apiEndpoint, settings)
  }
};




module.exports = {
  init,
};
