// Helpers
const inquirer = require('inquirer');
const ui = new inquirer.ui.BottomBar();

// Scripts
const getToken = require('./scripts/getToken.js');
const getLocales = require('./scripts/getLocales.js');
const createLocales = require('./scripts/createLocales.js');
const updateLocales = require('./scripts/updateLocales.js');
const updateLiveLayout = require('./scripts/updateLiveLayout.js');
const nikeCreateLayouts = require('./scripts/nikeLayouts.js');
const getStoreServices = require('./scripts/store_services/get.js');

var companyQuestionsPrompt = [
  { type: 'input', name: 'company', message: 'Enter the company code' },
  { type: 'input', name: 'enviroment', message: 'Which enviroment?' },
  { type: 'input', name: 'username', message: 'Enter Username/Email' },
  { type: 'password', name: 'password', message: 'Enter password' },
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
      'Update Live Layout',
      new inquirer.Separator(),
      'Nike Create Layouts',
      new inquirer.Separator(),
      'Get Store Services',
      'Create Store Services'
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
        ui.log.write('In progress!')
      } else {
        ui.log.write("Script Unavaliable");
      }
    });
};

init();