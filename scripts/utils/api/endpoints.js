// V4 Endpoints
const AUTH_ENDPOINT = '/v4/authentication/legacy'
const LOCALE_ENDPOINT = '/v4/locales'
const LAYOUTS_ENDPOINT = '/v4/layouts'

// V3 Endpoints
const INDEX_STORE_SERVICE_ENDPOINT = '/api/v3/admin/store_services'
const GET_STORES_ENDPOINT = '/api/v3/admin/stores'
const CREATE_STORE_SERVICE_ENDPOINT = (storeId) => {
  const endpoint = '/api/v3/admin/stores/' + storeId + '/store_services'

  return endpoint
}

const UPDATE_STORE_SERVICE_ENDPOINT = (storeId, storeServiceId) => {
  const endpoint = '/api/v3/admin/stores/' + storeId + '/store_services/' + storeServiceId

  return endpoint
}

module.exports = {
  AUTH_ENDPOINT,
  LOCALE_ENDPOINT,
  LAYOUTS_ENDPOINT,
  GET_STORES_ENDPOINT,
  INDEX_STORE_SERVICE_ENDPOINT,
  CREATE_STORE_SERVICE_ENDPOINT,
  UPDATE_STORE_SERVICE_ENDPOINT
};
