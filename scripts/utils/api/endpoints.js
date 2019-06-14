// V4 Endpoints
const AUTH_ENDPOINT = '/v4/authentication/legacy'
const LOCALE_ENDPOINT = '/v4/locales'
const LAYOUTS_ENDPOINT = '/v4/layouts'

// V3 Endpoints
const INDEX_STORE_SERVICE_ENDPOINT = '/api/v3/admin/store_services'
const CREATE_STORE_SERVICE_ENDPOINT = (storeId, isStoreNumber) => {
  var endpoint = '/api/v3/admin/stores/' + storeId + '/store_services'

  return endpoint
}

module.exports = {
  AUTH_ENDPOINT,
  LOCALE_ENDPOINT,
  LAYOUTS_ENDPOINT,
  INDEX_STORE_SERVICE_ENDPOINT,
  CREATE_STORE_SERVICE_ENDPOINT
};
