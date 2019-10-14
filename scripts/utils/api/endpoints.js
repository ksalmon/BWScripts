// V4 Endpoints
const AUTH_ENDPOINT = '/v4/authentication/legacy'
const LOCALE_ENDPOINT = '/v4/locales'
const LAYOUTS_ENDPOINT = '/v4/layouts'
const TRANSLATIONS_ENDPOINT = '/v4/translations'
const TEMPLATES_ENDPOINT = '/v4/notifications/templates'
const HOURS_ENDPOINT = '/v4/hours'
const ORGANIZATIONS_ENDPOINT = (orgId) => {
  const endpoint = '/v4/organizations' + orgId 
  return endpoint
}

// V3 Endpoints
const INDEX_STORE_SERVICE_ENDPOINT = '/api/v3/admin/store_services'
const GET_STORES_ENDPOINT = '/api/v3/admin/stores'
const GET_USERS_ENDPOINT = '/api/v3/admin/users'
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
  TRANSLATIONS_ENDPOINT,
  TEMPLATES_ENDPOINT,
  HOURS_ENDPOINT,
  ORGANIZATIONS_ENDPOINT,
  GET_STORES_ENDPOINT,
  GET_USERS_ENDPOINT,
  INDEX_STORE_SERVICE_ENDPOINT,
  CREATE_STORE_SERVICE_ENDPOINT,
  UPDATE_STORE_SERVICE_ENDPOINT
};
