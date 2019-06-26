const { constructApiRoot, constructV4ApiEndpoint } = require('../api/apiHelpers.js');
const { AUTH_ENDPOINT } = require('../api/endpoints.js');
const api = require('../api/callApi.js')

const fetchToken = (a) => {
  let apiRoot = constructApiRoot(a.company, a.environment)
  let apiEndpoint = constructV4ApiEndpoint(a.environment, AUTH_ENDPOINT)

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