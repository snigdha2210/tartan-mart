import { useState, useEffect } from 'react';
import '../assets/CheckoutPage.css';
import NavBar from '../components/Nav';
import Footer from '../components/Footer';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Container,
  Grid,
  CardMedia,
  Alert,
} from '@mui/material';
import { theme } from '../../theme';

import CounterUnits from '../components/CounterUnits.jsx';

import { useSelector } from 'react-redux';
import { postRequest } from '../util/api.jsx';
import ErrorModal from '../components/ErrorModal.jsx';

const API_URL = import.meta.env.VITE_REACT_APP_PROD_BACKEND_URL;

export default function CheckoutPage() {
  const [message, setMessage] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { cartItems } = useSelector(state => {
    return state.cart;
  });

  const { profile } = useSelector(state => {
    return state.profile;
  });

  const { total } = useSelector(state => ({
    total: state.cart.total,
  }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    console.log('CART VALIDATE:' + JSON.stringify(cartItems));

    const formData = new FormData(e.target);
    const formDataObject = {};
    formData.forEach((value, key) => {
      console.log('KEY:' + key);
      console.log('VALUE:' + value);
      formDataObject[key] = value;
    });

    const requestData = {
      ...formDataObject,
      cartItems: cartItems,
    };

    console.log('DATA BODY:' + JSON.stringify(requestData));

    try {
      const response = await postRequest(
        `${API_URL}/api/stripe/create-checkout-session`,
        requestData,
        'application/json'
      );

      if (response) {
        console.log('GOING TO STRIPE CHECKOUT');
        window.location.href = response.url;
      }
    } catch (error) {
      console.log('CHECKOUT ERROR:' + error.message);
      const errorMessage = JSON.parse(error.message);
      if (errorMessage.errors) {
        setErrorMessage(errorMessage.errors);
        setShowModal(true);
      } else {
        console.error('Error while creating checkout session:', error);
      }
    }
    setLoading(false);
  };

  const shoppingCart = { items: cartItems, total: 139 };
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    if (query.get('success')) {
      setMessage('Order placed! You will receive an email confirmation.');
      setPaymentStatus(true);
      console.log('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
      setPaymentStatus(false);
      console.log(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, []);

  const { username, email, isLoggedIn } = useSelector(state => {
    return state.auth;
  });

  return showModal ? (
    <ErrorModal errorMessage={errorMessage} redirectPath="/listings" />
  ) : message.length > 0 ? (
    <>
      <NavBar
        loggedIn={isLoggedIn}
        accountDetails={{ username: username, email: email }}
      />
      <div className="payment-status">
        <Alert severity={paymentStatus ? 'success' : 'error'}>{message}</Alert>
      </div>
      <Footer />
    </>
  ) : (
    <>
      <NavBar
        loggedIn={isLoggedIn}
        accountDetails={{ username: username, email: email }}
      />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" gutterBottom>
            Review Your Order
          </Typography>
          <Card>
            <CardContent>
              <Typography variant="h6">Your Order</Typography>
              {shoppingCart.items.map(item => (
                <Card
                  key={item.item.id}
                  sx={{ display: 'flex', my: 2, height: '150px' }}
                >
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}
                  >
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Typography variant="h5" component="div">
                        {item.item.name}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        component="div"
                      >
                        {item.description}
                      </Typography>
                      <Typography variant="h6" color={theme.primary.red}>
                        ${item.item.price}
                      </Typography>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
                      >
                        <CounterUnits selectedItem={item} />
                      </Box>
                    </CardContent>
                  </Box>
                  <CardMedia
                    component="img"
                    sx={{ width: 'auto' }}
                    image={item.item.image}
                    alt={item.item.name}
                  />
                </Card>
              ))}

              <Typography variant="h6" className="total-price">
                Total: ${total.toFixed(2)}
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      label="Email"
                      fullWidth
                      variant="outlined"
                      defaultValue={profile.email}
                      disabled
                      name="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      label="Full name"
                      fullWidth
                      variant="outlined"
                      defaultValue={profile.name}
                      disabled
                      name="fullName"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      label="Address"
                      fullWidth
                      variant="outlined"
                      defaultValue={profile.address}
                      name="address"
                    />
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    my: 2,
                  }}
                >
                  <Button variant="outlined" color="error">
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={loading}
                  >
                    Continue to Payment
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Container>
      <Footer />
    </>
  );
}
