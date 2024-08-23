const BASE_URL = `${import.meta.env.VITE_REACT_APP_PROD_BACKEND_URL}/`;
const API_ENDPOINTS = {
  healthCheck: BASE_URL + 'healthcheck/',
  validateToken: BASE_URL + 'token/',
  getCSRFCookie: BASE_URL + 'setcsrfcookie/',
  addItem: BASE_URL + 'addItem/',
  getItems: BASE_URL + 'listings/',
  getItemById: BASE_URL + 'listings/' + 'item/',
  getProfile: BASE_URL + 'getProfile/',
  updateItemStatus: BASE_URL + 'updateItemStatus/',
  updateProfileSettings: BASE_URL + 'updateProfile/',
  getOrderDetails: BASE_URL + 'getOrderDetails/',
  getOrder: BASE_URL + 'getOrder/',
};

export default API_ENDPOINTS;
