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
import DisplayListingPage from './pages/DisplayListingPage';

function App() {
  const { isLoggedIn } = useSelector(state => {
    return state.auth;
  });

  // Hide pages
  const showPages = {
    showHome: true,
    showListings: true,
    showItemDetails: true,
    showCheckout: false,
    showOrderDetails: false,
    showAddItem: true,
    showDisplayListing: true,
    showMyProfile: true,
    showAboutUs: true,
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={showPages.showHome ? <Home /> : <NotFound />}
        />
        <Route
          path="/home"
          element={showPages.showHome ? <Home /> : <NotFound />}
        />
        <Route
          path="/listings"
          element={showPages.showListings ? <ListingsPage /> : <NotFound />}
        />
        <Route
          path="/listings/item-detail/:id"
          element={
            showPages.showItemDetails ? <ItemDetailsPage /> : <NotFound />
          }
        />

        <Route
          path="/checkout"
          element={
            showPages.showCheckout ? (
              isLoggedIn ? (
                <CheckoutPage />
              ) : (
                <AuthPopup />
              )
            ) : (
              <NotFound />
            )
          }
        />
        <Route
          path="/order-details/:orderId"
          element={
            showPages.showOrderDetails ? (
              isLoggedIn ? (
                <OrderDetailsPageAgain />
              ) : (
                <AuthPopup />
              )
            ) : (
              <NotFound />
            )
          }
        />
        <Route
          path="/add-item"
          element={
            showPages.showAddItem ? (
              isLoggedIn ? (
                <AddItemPage />
              ) : (
                <AuthPopup />
              )
            ) : (
              <NotFound />
            )
          }
        />
        <Route
          path="/listing/:listingId"
          element={
            showPages.showDisplayListing ? (
              isLoggedIn ? (
                <DisplayListingPage />
              ) : (
                <AuthPopup />
              )
            ) : (
              <NotFound />
            )
          }
        />

        <Route
          path="/my-profile"
          element={
            showPages.showMyProfile ? (
              isLoggedIn ? (
                <ProfilePage />
              ) : (
                <AuthPopup />
              )
            ) : (
              <NotFound />
            )
          }
        />
        <Route
          path="/about-us"
          element={showPages.showAboutUs ? <AboutUsPage /> : <NotFound />}
        />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
