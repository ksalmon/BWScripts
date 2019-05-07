// Helpers
const inquirer = require('inquirer');
const ui = new inquirer.ui.BottomBar();

// Scripts
const getToken = require('./scripts/utils/auth/getToken')

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

var companyQuestionsPrompt = [
  { type: 'input', name: 'company', message: 'Enter the company code' },
  { type: 'list', name: 'enviroment', message: 'Which environment?', choices: [
    'Staging',
    'UAT',
    'Production' 
  ]},
  { type: 'list', name: 'type', message: 'Which endpoint?', choices: [
      'Locales',
      'Services',
      'Users',
      'Layouts'
  ]},
  { type: 'input', name: 'username', message: 'Enter Username/Email' },
  { type: 'password', mask: '*', name: 'password', message: 'Enter password' },
];

var scriptQuestionsPrompt = [
  { 
    type: 'list', 
    name: 'choose_script', 
    message: 'Choose a Script',
    choices: [
      new inquirer.Separator(),
      'Get Locales',
      'Create Locales',
      'Update Locales',
      new inquirer.Separator(),
      'Get Live Layout',
      'Create Live Layout',
      'Update Live Layout',
      new inquirer.Separator(),
      'Nike Create Layouts',
      new inquirer.Separator(),
      'Get Store Services',
      'Create Store Services',
      'Update Store Services'
    ]
  },
];

const init = () => {
  ui.log.write("Before we get started, let's get some more information!");
  inquirer.prompt(companyQuestionsPrompt)
    .then(async (answers) => {
      const auth = await getToken.fetchToken(answers);
      chooseScript(auth, answers)
      return
    })
    .catch(e => console.log(e));
};

const chooseScript = (auth, data) => {
  ui.log.write("Great, what script would you like to run!?");
  inquirer.prompt(scriptQuestionsPrompt)
    .then(answer => {
      if (answer.choose_script == 'Get Locales') {
        getLocales.init(auth, data);
      } else if (answer.choose_script == 'Create Locales') {
        createLocales.init(auth, data);
      } else if (answer.choose_script == 'Update Locales') {
        updateLocales.init(auth, data)
      } else if (answer.choose_script == 'Update Live Layout') {
        updateLiveLayout.init(auth, data)
      } else if (answer.choose_script == 'Nike Create Layouts') {
        nikeCreateLayouts.init(auth, data)
      } else if (answer.choose_script == 'Get Store Services') {
        getStoreServices.init(auth, data)
      } else if (answer.choose_script == 'Create Store Services') {
        createStoreServices.init(data)
      } else {
        ui.log.write("Script Unavaliable");
      }
    });
};

init();