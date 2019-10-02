const startQuestions = [
  { type: 'input', name: 'company', message: 'Enter the company name', validate: (company) => { return company !== ''} },
  { type: 'list', name: 'environment', message: 'Which environment?', choices: ['Staging', 'UAT', 'Production'] },
  { type: 'list', name: 'type', message: 'Please choose an option', choices: ['Locales', 'Users', 'Store Services', 'Templates', 'Layouts', 'Stores', 'Translations', 'Store Features', 'Hours'] },
  { type: 'input', name: 'username', message: 'Enter Username/Email' },
  { type: 'password', mask: '*', name: 'password', message: 'Enter password' },
];

const localeQuestions = [
  { type: 'list', name: 'localePrompt', choices: ['Get Locales', 'Create Locales', 'Update Locales'] }
]

const servicesQuestions = [
  { type: 'list', name: 'servicesPrompt', choices: ['Get Store Services', 'Create Store Services', 'Update Store Services'] }
]

const storesQuestions = [
  { type: 'list', name: 'storesPrompt', choices: [ 'Get Stores'] }
]

const layoutsQuestions = [
  { type: 'list', name: 'layoutsPrompt', choices: ['Create Layouts', 'Update Live Layouts', 'Create Nike Layouts'] }
]

const translationsQuestions = [
  { type: 'list', name: 'translationsPrompt', choices: ['Get Translations', 'Create Translations'] }
]

const featuresQuestions = [
  { type: 'list', name: 'featuresPrompt', choices: ['Get Store Features', 'Create Store Features'] }
]

const templatesQuestions = [
  { type: 'list', name: 'templatesPrompt', choices: ['Get Templates'] }
]

const hoursQuestions = [
  { type: 'list', name: 'hoursPrompt', choices: ['Get Hours'] }
]

const usersQuestions = [
  { type: 'list', name: 'usersPrompt', choices: ['Get Users'] }
]

module.exports = {
  startQuestions,
  localeQuestions,
  servicesQuestions,
  storesQuestions,
  layoutsQuestions,
  translationsQuestions,
  featuresQuestions,
  templatesQuestions,
  hoursQuestions,
  usersQuestions
}