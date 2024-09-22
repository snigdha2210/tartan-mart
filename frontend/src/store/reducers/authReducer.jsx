import * as actionTypes from '../actions/actionTypes';

const initialState = {
  username: null,
  email: null,
  picture: null,
  isLoggedIn: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.USER_LOGIN:
      return {
        ...state,
        username: action.username,
        email: action.email,
        picture: action.picture,
        isLoggedIn: true,
      };

    case actionTypes.USER_LOGOUT:
      return {
        ...state,
        username: null,
        email: null,
        picture: null,
        isLoggedIn: false,
      };
    default:
      return state;
  }
};

export default authReducer;
