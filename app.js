// Helpers
const inq = require('inquirer')
const ui = new inq.ui.BottomBar()
const questions = require('./scripts/utils/helpers/questions')

// Scripts
const getToken = require('./scripts/utils/auth/getToken.js')

// Organizations Scripts
const getOrganizations = require('./scripts/organizations/get.js')
const updateOrganizations = require('./scripts/organizations/update.js')

// Locale Scripts
const getLocales = require('./scripts/locales/get.js')
const createLocales = require('./scripts/locales/post.js')
const updateLocales = require('./scripts/locales/update.js')

// Layout Scripts
const nikeCreateLayouts = require('./scripts/layouts/nikeLayouts.js')
const createLiveLayouts = require('./scripts/layouts/post.js')
const getLiveLayouts = require('./scripts/layouts/get.js')
const updateLiveLayouts = require('./scripts/layouts/update.js')

// Store Services
const getStoreServices = require('./scripts/store_services/get.js')
const createStoreServices = require('./scripts/store_services/post.js')
const updateStoreServices = require('./scripts/store_services/update.js')

// Stores
const getStores = require('./scripts/stores/get.js')

// Templates
const getTemplates = require('./scripts/templates/get.js')

// Translations
const getTranslations = require('./scripts/translations/get.js')
const createTranslations = require('./scripts/translations/post.js')

// Store Features
const getStoreFeatures = require('./scripts/store_features/get.js')
const createStoreFeatures = require('./scripts/store_features/post.js')

// Hours 
const getHours = require('./scripts/hours/get.js')

// Users 
const getUsers = require('./scripts/users/get.js')


const init = () => {
  ui.log.write('Just a few questions before we begin.');
  inq.prompt(questions.startQuestions)
  .then(async(answers) => {
      const auth = await getToken.fetchToken(answers);
      scriptChoice(auth, answers)
  })
  .catch(err => console.log(err))
}

const scriptChoice = (auth, data) => {
  ui.log.write('What are you trying to do?')
  if(data.type == 'Locales') {
      inq.prompt(questions.localeQuestions)
      .then(answer => {
          if(answer.localePrompt == 'Get Locales') {
              getLocales.init(auth, data);
          } else if(answer.localePrompt == 'Create Locales') {
              createLocales.init(auth, data)
          } else if(answer.localePrompt == 'Update Locales') {
              updateLocales.init(auth, data)
          }
      })
  } else if(data.type == 'Organizations') {
    inq.prompt(questions.organizationsQuestions)
      .then(answer => {
        if(answer.organizationsPrompt == 'Get Organizations') {
          getOrganizations.init(auth, data)
        } else if(answer.organizationsPrompt == 'Update Organizations') {
          updateOrganizations.init(auth, data)
        }
      })
  } else if(data.type == 'Store Services') {
      inq.prompt(questions.servicesQuestions)
      .then(answer => {
          if(answer.servicesPrompt == 'Get Store Services') {
              getStoreServices.init(data)
          } else if(answer.servicesPrompt == 'Create Store Services') {
              createStoreServices.init(data)
          } else if(answer.storeServicesPrompt == 'Update Store Services') {
              updateStoreServices.init(data)
          }
      })
  } else if(data.type == 'Hours') {
      inq.prompt(questions.hoursQuestions)
      .then(answer => {
        if(answer.hoursPrompt == 'Get Hours') {
          getHours.init(auth, data)
        }
      })
  } else if(data.type == 'Templates') {
      inq.prompt(questions.templatesQuestions)
      .then(answer => {
        if (answer.templatesPrompt == 'Get Templates') {
          getTemplates.init(auth, data)
        } 
      })
  } else if(data.type == 'Layouts') {
      inq.prompt(questions.layoutsQuestions)
      .then(answer => {
          if(answer.layoutsPrompt == 'Update Live Layouts') {
              updateLiveLayouts.init(auth, data)
          } else if(answer.layoutsPrompt == 'Create Layouts') {
              createLiveLayouts.init(auth, data)
          } else if(answer.layoutsPrompt == 'Get Layouts') {
              getLiveLayouts.init(auth, data)
          } else if(answer.layoutsPrompt == 'Create Nike Layouts') {
              nikeCreateLayouts.init(auth, data)
          }
      })
  } else if(data.type == 'Stores') {
    inq.prompt(questions.storesQuestions)
    .then(answer => {
        if(answer.storesPrompt == 'Get Stores') {
            getStores.init(data)
        }
    })
  } else if(data.type == 'Translations') {
    inq.prompt(questions.translationsQuestions)
    .then(answer => {
      if(answer.translationsPrompt == 'Get Translations') {
        getTranslations.init(auth, data)
      } else if(answer.translationsPrompt == 'Create Translations') {
        createTranslations.init(auth, data)
      }
    })
  } else if (data.type == 'Users') {
    inq.prompt(questions.usersQuestions)
    .then(answer => {
      if(answer.usersPrompt == 'Get Users') {
        getUsers.init(data)
      }
    })
  } else if(data.type = 'Store Features') {
    inq.prompt(questions.featuresQuestions)
    .then(answer => {
      if(answer.featuresPrompt == 'Get Store Features') {
        getStoreFeatures.init(data)
      } else if(answer.featuresPrompt = 'Create Store Features') {
        createStoreFeatures.init(data)
      }
    })
  } else {
    ui.log.write('Unavailable Script')
  }
}

init();