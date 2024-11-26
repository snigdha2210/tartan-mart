import * as actionTypes from '../actions/actionTypes';

const initialState = {
  cartItems: [],
  status: '',
  total: 0,
};

function calculateTotalPrice(cartItems) {
  return cartItems.reduce((total, cartItem) => {
    return total + cartItem.item.price * cartItem.quantity;
  }, 0);
}

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_TO_CART:
      const existingItemIndex = state.cartItems.findIndex(item => {
        return item.item.id === action.item.item.id;
      });

      if (existingItemIndex !== -1) {
        const updatedCartItems = [...state.cartItems];

        if (
          action.item.item.quantity >
          updatedCartItems[existingItemIndex].quantity
        ) {
          updatedCartItems[existingItemIndex].quantity += action.quantity;

          return {
            ...state,
            cartItems: updatedCartItems,
            status: 'updated',
            total: calculateTotalPrice(updatedCartItems),
          };
        }

        if (
          action.item.item.quantity ==
            updatedCartItems[existingItemIndex].quantity &&
          action.quantity == -1
        ) {
          updatedCartItems[existingItemIndex].quantity += action.quantity;

          return {
            ...state,
            cartItems: updatedCartItems,
            status: 'updated',
            total: calculateTotalPrice(updatedCartItems),
          };
        }

        return {
          ...state,
          cartItems: updatedCartItems,
          status: 'unchanged',
          total: calculateTotalPrice(updatedCartItems),
        };
      }

      return {
        ...state,
        total: calculateTotalPrice([
          ...state.cartItems,
          { ...action.item, quantity: action.quantity },
        ]),
        status: 'updated',
        cartItems: [
          ...state.cartItems,
          { ...action.item, quantity: action.quantity },
        ],
      };

    case actionTypes.REMOVE_FROM_CART:
      const updatedCartItems = state.cartItems.filter(
        item => item.item.id !== action.itemId
      );
      return {
        ...state,
        cartItems: updatedCartItems,
        total: calculateTotalPrice(updatedCartItems),
      };

    case actionTypes.CLEAR_CART:
      console.log('CART CLEARED!');
      return initialState;

    default:
      return state;
  }
};

export default cartReducer;
