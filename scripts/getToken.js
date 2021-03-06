const { constructApiRoot, constructV4ApiEndpoint } = require('./utils/apiHelpers');
const { AUTH_ENDPOINT } = require('./utils/endpoints');
const api = require('./utils/callApi.js')

const fetchToken = (a) => {
  let apiRoot = constructApiRoot(a.company, a.enviroment)
  let apiEndpoint = constructV4ApiEndpoint(a.enviroment, AUTH_ENDPOINT)

  let headerData = {
    "username": a.username,
    "password": a.password,
    "companyApiRoot": apiRoot,
  }

  let settings = {
    method: 'post',
    headers: { 'Content-Type': 'application/json'},
    data: JSON.stringify(headerData)
  }
  
  return api.call(apiEndpoint, settings)
};

module.exports = {
  fetchToken,
};