import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import NavBar from '../components/Nav';
import Loader from '../components/Loader';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Typography, Box, CardMedia, Divider, Chip, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

import { fetchItem, addToCart, updateSelectedItem } from '../store/actions/actions';
import { getRequestAuthed } from '../util/api';
import { useTheme } from '@emotion/react';

import FormattedDate from '../components/FormattedDate.jsx';
import API_ENDPOINTS from '../constants/apiEndpoints.js';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

function renderDeliveryPickUpDetails({ item }) {
  return (
    <>
      {item.delivery_or_pickup === 'pickup' && (
        <Typography>Pickup address: {item.pickup_address}</Typography>
      )}
      {item.delivery_or_pickup === 'delivery' && (
        <Typography>
          {/* <LocalShippingIcon style={{ marginRight: 8 }} /> */}
          Delivered to you in {item.delivery_time} days
        </Typography>
      )}
    </>
  );
}

const ItemDetailsPage = () => {
  const theme = useTheme();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { id } = useParams();
  const { username, email, isLoggedIn } = useSelector((state) => state.auth);

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
        console.error('Error in GET request:', error);
      } finally {
        setLoading(false);
      }
    };
    getItemOnItemDetailsPage(id);
  }, []);

  const { selectedItem } = useSelector((state) => state.items);
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

  const handleContactSeller = () => {
    const whatsappUrl = `https://wa.me/${seller.seller_mobile_number}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <NavBar
        loggedIn={isLoggedIn}
        accountDetails={{ username: username, email: email }}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '20px auto',
          maxWidth: '1200px',
          width: '100%',
          minHeight: '70vh',
          border: '1px solid #ddd',
          padding: '20px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        }}
      >
        <CardMedia
          component="img"
          image={item.image}
          alt={item.name}
          sx={{ width: '100%', maxWidth: '800px', height: 'auto', objectFit: 'contain', marginBottom: '20px' }}
        />

        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Product</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">{item.name}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Price</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">${item.price}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Units</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">{item.quantity}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Description</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">{item.description}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Category</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={item.category}
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Listed On</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">
                    <FormattedDate date={item.listed_date} />
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Pickup/Delivery</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">
                    {renderDeliveryPickUpDetails({ item })}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Seller</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">{seller.seller_name}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Button
          variant="contained"
          onClick={handleContactSeller}
          startIcon={<WhatsAppIcon />}
          sx={{
            background: theme.primary.red,
            width: '100%',
            mt: 2,
            mb: 2,
          }}
        >
          Contact Seller on WhatsApp
        </Button>
      </Box>
      <Footer />
    </>
  );
};

export default ItemDetailsPage;
