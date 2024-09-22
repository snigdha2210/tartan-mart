import * as actionTypes from '../actions/actionTypes';

const initialState = {
  items: null,
  selectedItem: null,
};

const itemsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_ITEMS:
      return {
        ...state,
        items: action.items,
        selectedItem: {},
        //   selectedItem: state.items.find(item => {
        //     if (state.selectedItem != null){
        //       return item.item.id == state.selectedItem.id;
        //     }
        //     return false;
        // })
      };
    case actionTypes.UPDATE_SELECTED_ITEM:
      return {
        ...state,
        selectedItem: action.selectedItem,
      };
    case actionTypes.FETCH_ITEM:
      return {
        ...state,
        selectedItem: state.items.find(item => {
          return item.item.id == action.item;
        }),
      };
    case actionTypes.CLEAR_ITEMS:
      return initialState;

    default:
      return state;
  }
};

export default itemsReducer;
