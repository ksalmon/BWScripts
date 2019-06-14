// API Endpoints
const bwUrl = '.brickworksoftware.com'

const constructApiRoot = (company, env) => {
    let baseUrl = '';
    baseUrl += company;
    if (env !== 'production' && env !== 'demo') {
        baseUrl += '-' + env
    }
    baseUrl += bwUrl;
    return baseUrl
}

const constructV3ApiEndpoint = (company, env, path, apiKey = null) => {
    let baseUrl = '';
    baseUrl += 'https://' + company;
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

const constructV4ApiEndpoint = (env, path) => {
    let baseUrl = '';
    baseUrl += 'https://api.';
    if (env == 'production') {
        baseUrl += bwUrl
    } else {
        baseUrl += 'bw-' + env + '.com'
    }
    baseUrl += path
    return baseUrl
}

module.exports = {
  constructApiRoot,
  constructV3ApiEndpoint,
  constructV4ApiEndpoint
}