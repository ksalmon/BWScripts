// Helpers
const inq = require('inquirer');
const ui = new inq.ui.BottomBar();

// Scripts
const getToken = require('./scripts/utils/auth/getToken.js')

// Locale Scripts
const getLocales = require('./scripts/locales/get.js')
const createLocales = require('./scripts/locales/post.js')
const updateLocales = require('./scripts/locales/update.js')

// Layout Scripts
// const updateLiveLayout = require('./scripts/layouts/update.js/');
const nikeCreateLayouts = require('./scripts/nikeLayouts.js');

// Store Services
const getStoreServices = require('./scripts/store_services/get.js');
const createStoreServices = require('./scripts/store_services/post.js')

var startQuestions = [
  { 
      type: 'input', 
      name: 'company', 
      message: 'Enter the company name', 
      validate: (company) => {
          return company !== '';
      }},
  { 
      type: 'list', 
      name: 'environment', 
      message: 'Which environment?', 
      choices: [
          'Staging',
          'UAT',
          'Production'
      ]
  },
  { 
      type: 'list', 
      name: 'type', 
      message: 'Please choose an option',
      choices: [
          'Locales',
          'Services',
          'Layouts',
      ]
  },
  { 
    type: 'input', 
    name: 'username', 
    message: 'Enter Username/Email' 
  },
  { 
    type: 'password', 
    mask: '*', 
    name: 'password', 
    message: 'Enter password' 
  },
];

var localeQuestions = [
  {
      type: 'list',
      name: 'localePrompt',
      choices: [
          'Get Locales',
          'Create Locales',
          'Update Locales',
      ]
  }
]

var servicesQuestions = [
  {
      type: 'list',
      name: 'servicesPrompt',
      choices: [
          'Get Store Services',
          'Create Store Services',
          'Update Store Services'
      ]
  }
]

var layoutsQuestions = [
  {
      type: 'list',
      name: 'layoutPrompt',
      choices: [
          'Get Live Layout',
          'Create Live Layout',
          'Update Live Layout'
      ]
  }
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
  } else if(data.type == 'Services') {
      inq.prompt(servicesQuestions)
      .then(answer => {
          if(answer.servicesPrompt == 'Get Store Services') {
              getStoreServices.init(auth, data)
          } else if(answer.servicesPrompt == 'Create Store Services') {
              createStoreServices.init(data)
          } else if(answer.servicesPrompt == 'Update Store Services') {
              ui.log.write('In Progress')
          }
      })
  } else if(data.type == 'Layouts') {
      inq.prompt(layoutsQuestions)
      .then(answer => {
          if(answer.layoutsPrompt == 'Get Live Layouts') {
              ui.log.write('In Progress')
          } else if(answer.layoutsPrompt == 'Create Live Layouts') {
              ui.log.write('In Progress')
          } else if(answer.layoutsPrompt == 'Update Live Layouts') {
              ui.log.write('In Progress')
          }
      })
  }
  else {
    ui.log.write('Unavailable Script')
  }
}

init();