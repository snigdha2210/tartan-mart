import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Alert,
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
} from '@mui/material';
import { getRequestAuthed } from '../util/api.jsx';
import API_ENDPOINTS from '../constants/apiEndpoints.js';
import { useDispatch } from 'react-redux';
import { clearCart } from '../store/actions/actions.jsx';
import FormattedDate from '../components/FormattedDate.jsx';
import { useTheme } from '@emotion/react';
import '../assets/ItemDetailsPage.css';
import Footer from '../components/Footer';
import NavBar from '../components/Nav';
import { useSelector } from 'react-redux';

export default function OrderDetailsPageAgain() {
  const { orderId } = useParams();
  const dispatch = useDispatch();

  const theme = useTheme();
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const { username, email, isLoggedIn } = useSelector(state => {
    return state.auth;
  });

  const navigateTo = useNavigate();
  const handleBackRedirect = () => {
    navigateTo(`/my-profile`, { state: { active: 'Purchased Orders' } });
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await getRequestAuthed(
          API_ENDPOINTS.getOrderDetails + orderId + '/'
        );
        console.log('RESPONSE:' + JSON.stringify(response));
        if (response) {
          setOrderDetails(response.order);
          setMessage('Order details fetched successfully!');
          setSuccess(true);
          dispatch(clearCart());
        } else {
          setMessage('Failed to fetch order details.');
          setSuccess(false);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        setMessage('Error fetching order details.');
        setSuccess(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, dispatch]);

  return (
    <>
      <NavBar
        loggedIn={isLoggedIn}
        accountDetails={{ username: username, email: email }}
        name=""
      />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" gutterBottom>
            Order Details
          </Typography>
          {message && (
            <Alert severity={success ? 'success' : 'error'}>{message}</Alert>
          )}
          {orderDetails && (
            <Card>
              <CardContent>
                <Typography variant="h6">Order Information</Typography>
                <Typography variant="body1">
                  Order ID: {orderDetails.id}
                </Typography>
                <Typography variant="body1">
                  Total Price: ${orderDetails.total_price}
                </Typography>
                <Typography variant="body1">
                  Payment Status: {orderDetails.payment_status}
                </Typography>{' '}
                <br />
                <Typography variant="body1">
                  Order Date: <FormattedDate date={orderDetails.order_date} />
                </Typography>{' '}
                <br />
                <Typography variant="body1">
                  Delivery Address: {orderDetails.delivery_address}
                </Typography>
              </CardContent>
            </Card>
          )}
          {orderDetails &&
            orderDetails.items.map((item, index) => (
              <Card key={index} sx={{ my: 2 }}>
                <CardMedia
                  component="img"
                  sx={{ width: 100, height: 100 }}
                  image={item.item_image} // Assuming the item image is provided in the data
                  alt={item.item_name}
                />
                <CardContent>
                  <Typography variant="h6">{item.item_name}</Typography>
                  <Typography variant="body1">
                    Quantity: {item.quantity}
                  </Typography>
                  {/* Add any other details you want to include */}
                </CardContent>
              </Card>
            ))}
          <Button
            variant="outlined"
            style={{ color: theme.primary.red, borderColor: theme.primary.red }}
            className="add-to-cart"
            onClick={handleBackRedirect}
          >
            Back to Orders
          </Button>
        </Box>
      </Container>
      <Footer />
    </>
  );
}
