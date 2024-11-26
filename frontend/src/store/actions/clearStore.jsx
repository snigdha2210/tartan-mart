import { userLogout } from './actions.jsx';
import { clearProfile } from './actions.jsx';
import { clearItems } from './actions.jsx';
import { clearCart } from './actions.jsx';

export function clearData(dispatch) {
  dispatch(userLogout());
  dispatch(clearProfile());
  dispatch(clearItems());
  dispatch(clearCart());
}
