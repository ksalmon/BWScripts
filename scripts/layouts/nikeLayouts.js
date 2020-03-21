const { constructApiRoot, constructV4ApiEndpoint } = require('../utils/api/apiHelpers.js');
const { LAYOUTS_ENDPOINT } = require('../utils/api/endpoints');
const api = require('../utils/api/callApi.js')

const inq = require('inquirer');

const { clientDirectory } = require('../utils/helpers/csvHelpers.js');
const csv = require('csv-parser')
const fs = require('fs')

const mkdirp = require('mkdirp');
const createCsvWriter = require('csv-writer').createObjectCsvWriter; 

var filenameQuestionPrompt = [
  { type: 'input', name: 'filename', message: 'What is the filename in the client directory? Please include slash. Leave blank for default: "/nikeLayouts.csv"' }
];

const init = (auth, data) => {
  var directory,
      filename;
  var defaultfilename = '/nikeLayouts.csv'
  inq.prompt(filenameQuestionPrompt)
    .then(answer => {
      filename = (answer.filename == '') ? defaultfilename : answer.filename;
      directory = clientDirectory('nike', data.environment, filename)
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
        getPointer(locales)
      });
  };

  const getPointer = (lc) => {
    lc.forEach((locale, index) => {

      let settings = { method: 'get', }
      api.call(pointerUrl(locale), settings)
        .then(data => {
          if (data && data.current && data.current.versions) {
            setTimeout(function(){
              getHeaderFooter(locale, data.current)
            }, index * 500);
          } else if (!data) {
            console.log('No data for locale: ', locale)
          } else {    
            console.log('No version for locale: ', locale)
          }
        })
    })
  }


  async function getHeaderFooter(locale, data) {
    let response = [];
    let settings = { method: 'get', }
    try {
      response['shared'] = await api.call(assetUrl('/shared-', locale, data), settings);
      response['header'] = await api.call(assetUrl('/commerce-header-', locale, data), settings);
      response['footer'] = await api.call(assetUrl('/footer-', locale, data), settings);
    } catch (err) {
      console.log(locale, err);
    }
    mapToAttr(locale, response)
  }

  const mapToAttr = (locale, response) => {


    const head = `<link nes="" rel="icon" sizes="192x192" href="https://assets.commerce.nikecloud.com/experience/ciclp/static/v1/478-c8f03282507/static/android-icon-192x192.png">
      <link rel="stylesheet" href="//assets.commerce.nikecloud.com/ncss/glyphs/2.1/css/glyphs.min.css">
      <link rel="stylesheet" href="//assets.commerce.nikecloud.com/ncss/1.0/dotcom/desktop/css/ncss.en-us.min.css">
      <link rel="stylesheet" href="https://s3.nikecdn.com/unite/app/561/styles/uniteTheme/import.css" type="text/css" charset="utf-8">
      <link rel="stylesheet" type="text/css" href="https://s3.amazonaws.com/assets.brickworksoftware.com/Nike/nikeTempModal.css" >
      <style>
      #brickworkApp { margin-top: 100px; }
      @media (max-width: 768px) {
      #brickworkApp { margin-top: 25px; }
      }
      .l-header{ z-index: 100 !important; }
      </style>
      <script>
        function launchTempModal() {
          const nikeModal = document.createElement('div')
          nikeModal.setAttribute('id', 'nikeModal')
          nikeModal.setAttribute('class', 'modal')
          nikeModal.innerHTML = "<span id='close'>&times;</span> <img class='modal-content' id='img01' src='https://s3.amazonaws.com/assets.brickworksoftware.com/Nike/image001+(7).png'>"
          nikeModal.style.zIndex = "999"
          const tempBanner = document.createElement('div')
          tempBanner.innerHTML = "<div id='tempBanner'>Temporary store closure in select countries starting March 15th - March 27th learn more <span id='action-item' style='text-decoration:underline;cursor:pointer;'>here</span></div>"
          tempBanner.style.display = "flex"
          tempBanner.style.position = "relative"
          tempBanner.style.left = "-8px"
          tempBanner.style.justifyContent = "center"
          tempBanner.style.alignItems = "center"
          tempBanner.style.width = "100vw"
          tempBanner.style.minHeight = "50px"
          tempBanner.style.height = "auto"
          tempBanner.style.padding= "10px"
          tempBanner.style.textAlign = "center"
          tempBanner.style.backgroundColor = "#eee"
          tempBanner.style.fontWeight = "500"
          const nikeHeader = document.querySelectorAll('nav.ncss-container')[0]
          nikeHeader.append(tempBanner, nikeModal)
          const closeButton = document.getElementById('close')
          const actionItem = document.getElementById('action-item')
          closeButton.addEventListener('click', () => {nikeModal.style.display = "none"})
          actionItem.addEventListener('click', () => {nikeModal.style.display = "block"})
        }
        function fireNike() {
          NikeDotcomNav.mount()
        }
        window.onload = (fireNike, launchTempModal);
      </script>`
    const header = response.shared.html + response.header.html;
    const footer = response.footer.html;
    let layout = {
      "data": {
        "type": "layouts",
        "attributes": {
          "comment": "Nike Layout for " + locale.bwLocale + " -- Time: "+ Date.now(),
          "headHtml": head,
          "headerHtml": header,
          "footerHtml": footer,
        },
        "relationships": {
          "locale": {
            "data": {
              "type": "locales",
              "id": locale.bwLocale
            }
          }
        },
      },
    }
    postToLayouts(locale, layout)
  }

  async function postToLayouts(locale, layoutData) {
    const apiEndpoint = constructV4ApiEndpoint(data.environment, LAYOUTS_ENDPOINT );

    let settings = {
      url: apiEndpoint,
      method: 'post',
      headers: { 'Authorization': 'Bearer ' + auth.token, },
      data: layoutData,
    }

    api.call(apiEndpoint, settings)
      .then(response => {
        let layout = {
          'locale': locale.bwLocale,
          'layoutId': response.data.id
        }
        mkdirp(clientDirectory('nike', data.environment), function(err) { 
          printToCSV(layout)
        });
      })
  }

  const printToCSV = (locale) => {
    const csvWriter = createCsvWriter({
      header: [
          {id: 'locale', title: 'Locale'},
          {id: 'layoutId', title: 'Layout ID'},
      ],
      append: true,
      path: clientDirectory('nike', data.environment, '/layoutIds.csv') 
    });
    csvWriter
      .writeRecords([locale])
      .then(()=> console.log('Added Layout: ', locale));
  }

  // Helpers
  const assetUrl = (file, locale, data) => {
    let filename = file + data.versions + '.json'
    let url = 'https://assets.commerce.nikecloud.com/dotcom/nav/generations/'+ locale.nikeCountry.toUpperCase() +'/'+ locale.nikeLang + '/' + data.id + filename;
    return url
  }

  const pointerUrl = (locale) => {
    let url = 'https://assets.commerce.nikecloud.com/dotcom/nav/generations/'+ locale.nikeCountry.toUpperCase() +'/'+ locale.nikeLang +'/pointer.json';
    return url
  }
};

module.exports = {
  init,
};
