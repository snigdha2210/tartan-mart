import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../assets/ItemDetailsPage.css';
import Footer from '../components/Footer';
import NavBar from '../components/Nav';
import Loader from '../components/Loader';
import { useSelector } from 'react-redux';
import {
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Snackbar,
} from '@mui/material';

import { theme } from '../../theme.js';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

import { useDispatch } from 'react-redux';
import {
  fetchItem,
  addToCart,
  updateSelectedItem,
} from '../store/actions/actions';
import { getRequest, getRequestAuthed } from '../util/api';

import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import FormattedDate from '../components/FormattedDate.jsx';
import API_ENDPOINTS from '../constants/apiEndpoints.js';

function renderDeliveryPickUpDetails({ item }) {
  return (
    <>
      {(() => {
        if (item.delivery_or_pickup === 'pickup') {
          return <p>Pickup address: {item.pickup_address}</p>;
        }
      })()}

      {(() => {
        if (item.delivery_or_pickup === 'delivery') {
          return (
            <p>
              <LocalShippingIcon />
              Delivery By: {item.delivery_time} days
            </p>
          );
        }
      })()}
    </>
  );
}

const ItemDetailsPage = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { id } = useParams();
  const { username, email, isLoggedIn } = useSelector((state) => {
    return state.auth;
  });

  const { status } = useSelector((state) => {
    return state.cart;
  });

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getItemOnItemDetailsPage = async (id) => {
      try {
        const response = await getRequestAuthed(API_ENDPOINTS.getItemById + id);
        if (response) {
          dispatch(updateSelectedItem(response));
        }
      } catch (error) {
        console.error('Error in POST request:', error);
      } finally {
        setLoading(false);
      }
    };
    getItemOnItemDetailsPage(id);
  }, []);

  const { items, selectedItem } = useSelector((state) => {
    return state.items;
  });

  let item = null;
  let seller = null;

  if (selectedItem) {
    ({ item, seller } = selectedItem);
  }

  const addItemToCart = async () => {
    const res = dispatch(addToCart(selectedItem));
    console.log(res);
    setSnackbarOpen(true);
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <>
      <NavBar
        loggedIn={isLoggedIn}
        accountDetails={{ username: username, email: email }}
        name=''
      />
      <div
        style={{
          padding: '20px',
          maxWidth: '800px',
          width: '90%',
          margin: 'auto',
          marginBottom: '10px',
        }}
        className='item-details-page-main'
      >
        <Card className='item-details-page'>
          <CardMedia
            component='img'
            src={item.image}
            alt={item.name}
            style={{ width: '100%', height: '300px', objectFit: 'contain' }}
          />
          <CardContent>
            <div className='item-details-text'>
              <Typography variant='h4'>{item.name}</Typography>
              <Typography paragraph>Description: {item.description}</Typography>
              <Typography paragraph>Price: {item.price}</Typography>
              <Typography paragraph>Units: {item.quantity}</Typography>
              <Typography paragraph>Category: {item.category}</Typography>
              <Typography variant='h6'>Listed On</Typography>
              <Typography paragraph>
                <FormattedDate date={item.listed_date} />
              </Typography>
              {/* TODO: Uncomment the below 4 lines after testing */}
              {/* {(() => {
                if (email && item.owner !== email) {
                  return ( */}
                    <Button
                      variant='outlined'
                      endIcon={
                        <ShoppingCartCheckoutIcon
                          sx={{ color: theme.primary.red }}
                        />
                      }
                      style={{
                        color: theme.primary.red,
                        borderColor: theme.primary.red,
                      }}
                      className='add-to-cart'
                      onClick={addItemToCart}
                    >
                      Add To Cart
                    </Button>
                  {/* ); */}
                {/* }
                return null;
              })()} */}
              {/* TODO: Uncomment the above 4 lines after testing */}

              <div className='delivery-method'>
                <Typography variant='h6'>
                  Pickup/Delivery: {item.delivery_or_pickup}
                </Typography>
                {renderDeliveryPickUpDetails({ item })}
              </div>
              <div className='seller-details'>
                <Typography variant='h6'>Seller:</Typography>
                <Typography paragraph>{seller.seller_name}</Typography>
                <Typography paragraph>Email: {seller.seller_email}</Typography>
                <Typography paragraph>
                  Contact Number: {seller.seller_mobile_number}
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>{' '}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={
          status === 'updated' ? 'Item added to cart!' : 'Item already in cart!'
        }
      />
      <Footer />
    </>
  );
};

export default ItemDetailsPage;
