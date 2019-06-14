require('es6-promise').polyfill();
const axios = require('axios');

const call = (endpoint, settings) => {
    return axios(endpoint, settings)
    .then(function(res) {
        console.log("Data: " + res.data + '\n' +"Success")
        return res.data;
    })
    .catch(function(err) {
      if(err.response.status !== 200 || err.response.status !== 201) {
        console.log('Error Code: ' + err.response.status + ' ' + err.response.statusText + '\n' + "Data: " + err.config.data + '\n' + 'Endpoint: ' + err.config.url)
      }
    })
}

module.exports = {
    call,
}