// src/store/reducers/profileReducer.js

import * as actionTypes from '../actions/actionTypes';
import storage from 'redux-persist/lib/storage'

const initialState = {
  my_listings: [],
  order_items: [],
  profile: {},
  my_orders: [],
};

const listingReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.REFRESH_PROFILE:
      return {
        ...state,
        my_items: action.my_items,
        order_items: action.order_items,
        profile: action.my_profile,
        my_orders: action.my_orders,
      };
    case actionTypes.UPDATE_PROFILE:
        return {
            ...state,
            profile: action.my_profile,
        };
    case actionTypes.CLEAR_PROFILE:
      //storage.removeItem('persist:root');
      return initialState;
    default:
      return state;
  }
};

export default listingReducer;