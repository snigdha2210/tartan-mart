import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel'; // Import the Carousel
import Footer from '../components/Footer';
import NavBar from '../components/Nav';
import Loader from '../components/Loader';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  Typography,
  Box,
  CardMedia,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Link,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { fetchItem, updateSelectedItem } from '../store/actions/actions';
import { getRequestAuthed } from '../util/api';
import { useTheme } from '@emotion/react';
import FormattedDate from '../components/FormattedDate.jsx';
import API_ENDPOINTS from '../constants/apiEndpoints.js';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ItemCard from '../components/ItemCard';
import { useNavigate } from 'react-router-dom';

function renderDeliveryPickUpDetails({ item }) {
  return (
    <>
      {item.delivery_or_pickup === 'pickup' && (
        <Typography>Pickup address: {item.pickup_address}</Typography>
      )}
      {item.delivery_or_pickup === 'delivery' && (
        <Typography>Delivered to you in {item.delivery_time} days</Typography>
      )}
    </>
  );
}

const ItemDetailsPage = () => {
  const theme = useTheme();
  const navigateTo = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { id } = useParams();
  const { username, email, isLoggedIn } = useSelector(state => state.auth);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [extraItems, setExtraItems] = useState([]);

  const { selectedItem } = useSelector(state => state.items);
  let item = null;
  let seller = null;

  if (selectedItem) {
    ({ item, seller } = selectedItem);
  }

  function groupIntoChunks(array, chunkSize) {
    const output = [];
    let currentChunk = [];

    array.forEach((item, index) => {
      currentChunk.push(item);

      if ((index + 1) % chunkSize === 0 || index === array.length - 1) {
        output.push(currentChunk);
        currentChunk = [];
      }
    });

    return output;
  }

  useEffect(() => {
    const getItemOnItemDetailsPage = async id => {
      try {
        const response = await getRequestAuthed(API_ENDPOINTS.getItemById + id);
        if (response) {
          dispatch(updateSelectedItem(response));
          setExtraItems(response.extra_items);
        }
      } catch (error) {
        console.error('Error in GET request:', error);
      } finally {
        setLoading(false);
      }
    };
    getItemOnItemDetailsPage(id);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [isLoggedIn, id]);

  if (loading) {
    return <Loader />;
  }

  if (!selectedItem) {
    return <Loader />;
  }

  if (!item) {
    return <Loader />;
  }

  const handleContactSeller = () => {
    const whatsappUrl = `https://wa.me/${seller.seller_mobile_number}`;
    window.open(whatsappUrl, '_blank');
  };

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
          image={
            item.image == undefined || item.image == null ? '' : item.image
          }
          alt={item.name}
          sx={{
            width: '100%',
            maxWidth: '800px',
            height: '400px',
            objectFit: 'contain',
            marginBottom: '20px',
          }}
        />

        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell sx={{ width: '40%' }}>
                  <Typography variant="h6">Product</Typography>
                </TableCell>
                <TableCell sx={{ width: '60%' }}>
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
                  <Chip label={item.category} variant="outlined" />
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
              {isLoggedIn ? (
                <>
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
                      <Typography variant="body1">
                        {seller.seller_name == null ||
                        seller.seller_name == undefined
                          ? ''
                          : seller.seller_name}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </>
              ) : (
                <></>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {isLoggedIn && (
          <Button
            variant="contained"
            onClick={handleContactSeller}
            startIcon={<WhatsAppIcon />}
            sx={{
              background: theme.primary.red,
              width: '100%',
              mt: 2,
              mb: 2,
              // color: theme.primary.red,
              borderColor: theme.primary.red,
              ':hover': {
                bgcolor: 'pink', // theme.palette.primary.main
                color: 'white',
                borderColor: 'pink',
              },
            }}
          >
            Contact Seller on WhatsApp
          </Button>
        )}
      </Box>
      {/* <Divider sx={{ width: '100%', marginTop: '40px', marginBottom: '20px' }} /> */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          // justifyContent: 'center',
          // alignItems: 'center',
          margin: '20px auto',
          maxWidth: '1200px',
          width: '100%',
          // minHeight: '70vh',
          border: '1px solid #ddd',
          padding: '20px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Carousel Section */}
        <Typography
          variant="h5"
          component="div"
          alignItems={'left'}
          align="left"
          style={{ justifySelf: 'left' }}
        >
          This seller is also selling...
        </Typography>
        <Carousel
          sx={{
            width: '100%',
            // maxWidth: '800px',
            margin: 'auto',
          }}
          animation="slide"
          duration={500}
          indicators={true}
        >
          {groupIntoChunks(extraItems, 3).map((group, groupIndex) => (
            <div style={{ display: 'flex' }}>
              {group.map((extraItem, extraItemIndex) => (
                <div style={{ margin: 10 }}>
                  <Link
                    style={{ textDecoration: 'none' }}
                    to={`item-detail/${extraItem.id}`}
                  >
                    <ItemCard
                      key={`${groupIndex}${extraItemIndex}`}
                      product={extraItem}
                      height="100"
                      onItemClick={() => {
                        // console.log('Clicked on:', extraItem);
                        navigateTo(`/listings/item-detail/${extraItem.id}`);
                      }}
                    />
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </Carousel>
      </Box>
      <Footer />
    </>
  );
};

export default ItemDetailsPage;
