const BASE_URL = `${import.meta.env.VITE_REACT_APP_LOCAL_BACKEND_URL}/`;
const API_ENDPOINTS = {
  healthCheck: BASE_URL + 'healthcheck/',
  validateToken: BASE_URL + 'token/',
  getCSRFCookie: BASE_URL + 'setcsrfcookie/',
  addItem: BASE_URL + 'addItem/',
  addListing: BASE_URL + 'addListing/',
  deleteListing: BASE_URL + 'deleteListing/',
  getItems: BASE_URL + 'store/',
  getItemById: BASE_URL + 'store/' + 'item/',
  getProfile: BASE_URL + 'getProfile/',
  updateItemStatus: BASE_URL + 'updateItemStatus/',
  updateProfileSettings: BASE_URL + 'updateProfile/',
  getOrderDetails: BASE_URL + 'getOrderDetails/',
  getOrder: BASE_URL + 'getOrder/',
  getListing: BASE_URL + 'listing/',
  updateListing: BASE_URL + 'updateListing/'
};

export default API_ENDPOINTS;
