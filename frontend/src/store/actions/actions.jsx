import * as actionTypes from './actionTypes';

export const userLogin = (username, email, picture) => {
  return {
    type: actionTypes.USER_LOGIN,
    username: username,
    email: email,
    picture: picture,
  };
};

export const userLogout = () => {
  const removeCookie = () => {
    document.cookie = 'jwt=;';
  };
  removeCookie();
  console.log('COOKIE REMOVED');
  return {
    type: actionTypes.USER_LOGOUT,
  };
};

export const updateItems = items => ({
  type: actionTypes.UPDATE_ITEMS,
  items: items,
});

export const updateSelectedItem = item => ({
  type: actionTypes.UPDATE_SELECTED_ITEM,
  selectedItem: item,
});

export const fetchItem = itemId => ({
  type: actionTypes.FETCH_ITEM,
  item: itemId,
});

export const clearItems = () => {
  return {
    type: actionTypes.CLEAR_ITEMS,
  };
};

export const refreshProfile = (my_listings, profile) => {
  return {
    type: actionTypes.REFRESH_PROFILE,
    my_listings: my_listings,
    my_profile: profile,
  };
};

export const clearProfile = () => {
  return {
    type: actionTypes.CLEAR_PROFILE,
  };
};

export const addArchive = my_items => {
  return {
    type: actionTypes.ADD_ARCHIVE,
    my_items: my_items,
  };
};

export const deleteItem = my_items => {
  return {
    type: actionTypes.DELETE_ITEM,
    my_items: my_items,
  };
};

export const updateProfile = my_profile => {
  return {
    type: actionTypes.UPDATE_PROFILE,
    my_profile: my_profile,
  };
};

export const addToCart = (item, quantity = 1) => {
  return {
    type: actionTypes.ADD_TO_CART,
    item: item,
    quantity: quantity,
  };
};

export const removeFromCart = itemId => {
  return {
    type: actionTypes.REMOVE_FROM_CART,
    itemId: itemId,
  };
};

export const clearCart = () => {
  return {
    type: actionTypes.CLEAR_CART,
  };
};
