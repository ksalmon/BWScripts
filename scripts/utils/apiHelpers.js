// Api Root Helpers
const constructApiRoot = (company, envo) => {
  let fetchUrl = ''
  fetchUrl += company
  if (envo !== 'production' && envo !== 'demo') {
    fetchUrl += '-' + envo 
  } 
  fetchUrl += '.brickworksoftware.com'
  return fetchUrl
}

// Endpoint Helpers
const constructV3ApiEndpoint = (company, envo, path) => {
  let fetchUrl = ''
  fetchUrl += 'https://' + company
  if (envo == 'production') {
    fetchUrl += 'brickworksoftware.com'
  } else {
    fetchUrl += '-' + envo + 'brickworksoftware.com'
  }
  fetchUrl += path
  return fetchUrl
}

const constructV4ApiEndpoint = (envo, path) => {
  let fetchUrl = ''
  fetchUrl += 'https://api.'
  if (envo == 'production') {
    fetchUrl += 'brickworksoftware.com'
  } else {
    fetchUrl += 'bw-' + envo + '.com'
  }
  fetchUrl += path
  return fetchUrl
}


module.exports = {
  constructApiRoot,
  constructV3ApiEndpoint,
  constructV4ApiEndpoint
};