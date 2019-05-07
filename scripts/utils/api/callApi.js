require('es6-promise').polyfill();
const axios = require('axios');

const call = (endpoint, settings) => {
  return axios(endpoint, settings)
    .then(function(response) {
      return response.data;
    }).catch(function(e) {
      if (e.response.status != 200 || e.response.status != 201) {
        console.log(e.response.statusText, endpoint, settings)
        console.log(e.response.data)
      }
    })
}

module.exports = {
  call,
};
