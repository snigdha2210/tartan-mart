import { createStore, combineReducers } from 'redux';
import authReducer from './reducers/authReducer';
import profileReducer from './reducers/profileReducer';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import itemsReducer from './reducers/itemsReducer';
import cartReducer from './reducers/cartReducer';

const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({
  auth: authReducer,
  items: itemsReducer,
  profile: profileReducer,
  cart: cartReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };
