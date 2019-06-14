require('es6-promise').polyfill();
const axios = require('axios');

const call = (endpoint, settings) => {
    return axios(endpoint, settings)
    .then(function(res) {
        console.log(res)
        return res.data;
    })
    .catch(function(err) {
      if(err.response.status !== 200 || err.response.status !== 201) {
        console.log(err.response.status + `\n` + err.response.statusText + '\n' + err.config.data)
      }
    })
}

module.exports = {
    call,
}