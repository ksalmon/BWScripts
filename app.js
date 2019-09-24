// Helpers
const inq = require('inquirer')
const ui = new inq.ui.BottomBar()

// Scripts
const getToken = require('./scripts/utils/auth/getToken.js')

// Locale Scripts
const getLocales = require('./scripts/locales/get.js')
const createLocales = require('./scripts/locales/post.js')
const updateLocales = require('./scripts/locales/update.js')

// Layout Scripts
const nikeCreateLayouts = require('./scripts/layouts/nikeLayouts.js');
const updateLiveLayout = require('./scripts/layouts/update.js')

// Store Services
const getStoreServices = require('./scripts/store_services/get.js')
const createStoreServices = require('./scripts/store_services/post.js')
const updateStoreServices = require('./scripts/store_services/update.js')

// Stores
const getStores = require('./scripts/stores/get.js')

// Translations
const getTranslations = require('./scripts/translations/get.js')
const createTranslations = require('./scripts/translations/post.js')

let startQuestions = [
  { type: 'input', name: 'company', message: 'Enter the company name', validate: (company) => { return company !== ''} },
  { type: 'list', name: 'environment', message: 'Which environment?', choices: ['Staging', 'UAT', 'Production'] },
  { type: 'list', name: 'type', message: 'Please choose an option', choices: ['Locales','Store Services','Layouts', 'Stores', 'Translations'] },
  { type: 'input', name: 'username', message: 'Enter Username/Email' },
  { type: 'password', mask: '*', name: 'password', message: 'Enter password' },
];

let localeQuestions = [
  { type: 'list', name: 'localePrompt', choices: ['Get Locales', 'Create Locales', 'Update Locales'] }
]

let servicesQuestions = [
  { type: 'list', name: 'servicesPrompt', choices: ['Get Store Services', 'Create Store Services', 'Update Store Services'] }
]

let storesQuestions = [
  { type: 'list', name: 'storesPrompt', choices: [ 'Get Stores'] }
]

let layoutsQuestions = [
  { type: 'list', name: 'layoutsPrompt', choices: ['Update Live Layouts', 'Create Nike Layouts'] }
]

let translationsQuestions = [
  { type: 'list', name: 'translationsPrompt', choices: ['Get Translations', 'Create Translations'] }
]



const init = () => {
  ui.log.write('Just a few questions before we begin.');
  inq.prompt(startQuestions)
  .then(async(answers) => {
      const auth = await getToken.fetchToken(answers);
      scriptChoice(auth, answers)
  })
  .catch(err => console.log(err))
}

const scriptChoice = (auth, data) => {
  ui.log.write('What are you trying to do?')
  if(data.type == 'Locales') {
      inq.prompt(localeQuestions)
      .then(answer => {
          if(answer.localePrompt == 'Get Locales') {
              getLocales.init(auth, data);
          } else if(answer.localePrompt == 'Create Locales') {
              createLocales.init(auth, data)
          } else if(answer.localePrompt == 'Update Locales') {
              updateLocales.init(auth, data)
          }
      })
  } else if(data.type == 'Store Services') {
      inq.prompt(servicesQuestions)
      .then(answer => {
          if(answer.servicesPrompt == 'Get Store Services') {
              getStoreServices.init(data)
          } else if(answer.servicesPrompt == 'Create Store Services') {
              createStoreServices.init(data)
          } else if(answer.storeServicesPrompt == 'Update Store Services') {
              updateStoreServices.init(data)
          }
      })
  } else if(data.type == 'Layouts') {
      inq.prompt(layoutsQuestions)
      .then(answer => {
          if(answer.layoutsPrompt == 'Update Live Layouts') {
              updateLiveLayout.init(auth, data)
          } else if(answer.layoutsPrompt == 'Create Nike Layouts') {
              nikeCreateLayouts.init(auth, data)
          }
      })
  } else if(data.type == 'Stores') {
    inq.prompt(storesQuestions)
    .then(answer => {
        if(answer.storesPrompt == 'Get Stores') {
            getStores.init(data)
        }
    })
  } else if(data.type == 'Translations') {
    inq.prompt(translationsQuestions)
    .then(answer => {
      if(answer.translationsPrompt == 'Get Translations') {
        getTranslations.init(auth, data)
      } else if(answer.translationsPrompt == 'Create Translations') {
        createTranslations.init(auth, data)
      }
    })
  } else {
    ui.log.write('Unavailable Script')
  }
}

init();