// API Endpoints
const bwUrl = '.brickworksoftware.com'

const constructApiRoot = (company, environment) => {
    let baseUrl = '';
    let env = environment.toLowerCase()
    baseUrl += company.split(' ').join('');
    if (env !== 'production' && env !== 'demo') {
        baseUrl += '-' + env
    }
    baseUrl += bwUrl;
    return baseUrl
}

const constructV3ApiEndpoint = (company, environment, path, apiKey = null) => {
    let baseUrl = '';
    let env = environment.toLowerCase()
    baseUrl += 'https://' + company.split(' ').join('');
    if(env == 'production') {
        baseUrl += bwUrl
    } else {
        baseUrl += '-' + env.toLowerCase() + bwUrl 
    }
    baseUrl += path
    if (apiKey) {
        baseUrl += '?api_key=' + apiKey
    }
    return baseUrl
}

const constructV4ApiEndpoint = (environment, path) => {
    let baseUrl = '';
    let env = environment.toLowerCase()
    baseUrl += 'https://api';
    if (env == 'production') {
        baseUrl += bwUrl
    } else {
        baseUrl += '.bw-' + env + '.com'
    }
    baseUrl += path
    return baseUrl
}

module.exports = {
  constructApiRoot,
  constructV3ApiEndpoint,
  constructV4ApiEndpoint
}