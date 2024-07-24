import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import './App.css';
import ListingsPage from './pages/ListingsPage';
import CheckoutPage from './pages/CheckoutPage';
import AddItemPage from './pages/AddItemPage';
import ProfilePage from './pages/ProfilePage';
import ItemDetailsPage from './pages/ItemDetailsPage';
import AboutUsPage from './pages/AboutUsPage';
import { useSelector } from 'react-redux';
import AuthPopup from './components/AuthPopup';
import OrderDetailsPageAgain from './pages/OrderDetailsPageAgain';
import NotFound from './pages/NotFound';

function App() {
  const { isLoggedIn } = useSelector((state) => {
    return state.auth;
  });
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/listings' element={<ListingsPage />} />
        <Route path='/listings/item-detail/:id' element={<ItemDetailsPage />} />

        <Route
          path='/checkout'
          element={isLoggedIn ? <CheckoutPage /> : <AuthPopup />}
        />
        <Route
          path='/order-details/:orderId'
          element={isLoggedIn ? <OrderDetailsPageAgain /> : <AuthPopup />}
        />
        <Route
          path='/add-item'
          element={isLoggedIn ? <AddItemPage /> : <AuthPopup />}
        />

        <Route
          path='/my-profile'
          element={isLoggedIn ? <ProfilePage /> : <AuthPopup />}
        />
        <Route path='/about-us' element={<AboutUsPage />} />
        <Route path='/*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
