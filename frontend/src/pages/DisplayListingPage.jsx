import React, { useState, useRef, useEffect } from 'react';
import NavBar from '../components/Nav';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Modal,
  Box,
  RadioGroup,
  Radio,
  FormControlLabel,
  ListItemText,
  Alert,
  Card,
  Grid,
  CardContent,
  OutlinedInput
} from '@mui/material';
import '../assets/AddItemPage.css';
import Footer from '../components/Footer.jsx';
import { useTheme } from '@emotion/react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import { categories_tabs } from '../constants/constants.jsx';
import API_ENDPOINTS from '../constants/apiEndpoints';
import { getRequest, getRequestAuthed, putRequest } from '../util/api';

import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useParams, useNavigate } from 'react-router-dom';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const DisplayListingPage = ({ match }) => {
  const theme = useTheme();
  
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [image, setImage] = useState(null);

  const [imagePreviews, setImagePreviews] = useState([]);

  const myref = useRef();

  const [deliveryPickupOption, setDeliveryPickupOption] = useState('');

  const [openSubmit, setOpenSubmit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [errorDisplay, setErrorDisplay] = useState('none');
  const [errorMessage, setErrorMessage] = useState('');

  const { my_items, order_items, profile, my_orders } = useSelector((state) => {
    return state.profile;
  });

    const { username, email, isLoggedIn } = useSelector((state) => {
    return state.auth;
  });

  const [pickupAddress, setPickupAddr] = useState(renderAddress());

  const [previewUrl, setPreviewUrl] = useState(null);

  const [items, setItems] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

//   const listingId = match.params.id;
  const { listingId } = useParams();

  useEffect(() => {
    // Fetch existing listing data
    const fetchListingData = async () => {
      try {
        const response = await getRequestAuthed(`${API_ENDPOINTS.getListing}/${listingId}`);
        const listing = response;
        console.log("LISTING:" + JSON.stringify(listing));
        setItemName(listing.name);
        setDescription(listing.description);
        setDeliveryPickupOption(listing.delivery_or_pickup);
        setItems(listing.listing_item);
        console.log("ITEMS:" + JSON.stringify(listing.listing_item));
        if (listing.delivery_or_pickup === 'delivery') {
          setDeliveryTime(listing.delivery_time);
        } else {
          setPickupAddr(listing.pickup_address);
        }
        
        // Set image previews if images exist
        const imagePreviews = listing.listing_item.map(item => item.image);
        setImagePreviews(imagePreviews);
        
      } catch (error) {
        console.error('Failed to fetch listing data:', error);
      }
    };

    fetchListingData();
  }, [listingId]);

  const validateFormData = () => {
    if (!itemName) throw new Error('No name set');
    if (!description || description.length < 30)
      throw new Error('Invalid or too short description');
    if (!deliveryPickupOption) throw new Error('Delivery or pickup not set');
    if (
      deliveryPickupOption === 'delivery' &&
      (!deliveryTime || deliveryTime === '')
    )
      throw new Error('Set the estimated delivery time in days');
    if (
      deliveryPickupOption === 'pickup' &&
      (!pickupAddress || pickupAddress === '')
    )
      throw new Error('Include the pickup address');
    if (items.length === 0) throw new Error('No items added');
    
    items.forEach((item, index) => {
      if (!item.image && !item.image_url) 
        throw new Error(`Item ${index + 1}: Invalid image`);
      if (!item.price || item.price <= 0)
        throw new Error(`Item ${index + 1}: Invalid price`);
      if (!item.quantity || item.quantity <= 0)
        throw new Error(`Item ${index + 1}: Invalid quantity`);
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      validateFormData();
      const listingData = {
        "name": itemName,
        "description": description,
        "delivery_or_pickup": deliveryPickupOption,
      };
      if (deliveryPickupOption === 'delivery') {
        listingData['delivery'] = deliveryTime
      } else {
        listingData['pickup_address'] = pickupAddress
      }

      function convertToNewObject(items) {
        const promises = items.map(item => {
          if (item.image) {
            const reader = new FileReader();

            return new Promise((resolve) => {
              reader.onloadend = () => {
                const newItem = {
                  ...item,
                  image_b64: reader.result,
                  image_name: item.image.name,
                };
                resolve(newItem);
              };
              reader.readAsDataURL(item.image);
            });
          } else {
            return Promise.resolve(item);
          }
        });

        return Promise.all(promises);
      }

      convertToNewObject(items).then(async newItems => {
        listingData['listing_item'] = newItems;
        await handlePutRequest(listingData);
      });
      
    } catch (error) {
      setErrorDisplay('show');
      setErrorMessage(error.message);
    }
  };

  function renderAddress() {
    if (profile.address != null) {
      return profile.address;
    }
    return '';
  }

  const handlePutRequest = async (body) => {
    try {
      const response = await putRequest(`${API_ENDPOINTS.updateListing}/${listingId}`, body, 'application/json');
      if (response) {
        setErrorDisplay('none');
      }
    } catch (error) {
      console.error('Error in PUT request:', error);
      setErrorDisplay('show');
      if (error.message) {
        setErrorMessage(error.message);
      }
      return;
    }
    clearForm();
  };

  const handleRadioDeliveryPickup = (event) => {
    setDeliveryPickupOption(event.target.value);
    if (event.target.value == 'delivery') {
      setPickupAddr(renderAddress());
    } else {
      setDeliveryTime('');
    }
  };

  // ... Rest of the component code, similar to AddItemPage

  return (
    <>
      <NavBar
        loggedIn={isLoggedIn}
        accountDetails={{ username: username, email: email }}
        name=''
      />
      <div className='page-container'>
        <div className='page-title-text' style={{ marginBottom: '20px' }}>
          Edit Listing
        </div>
        <Alert severity='error' sx={{ display: errorDisplay }}>
          {errorMessage}
        </Alert>
        <Card
          className='add-item-page'
          style={{
            padding: '20px',
            maxWidth: '1000px',
            height: '100%',
            width: '100%',
            margin: 'auto',
          }}
        >
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className='add-item-input' style={{ marginBottom: '20px' }}>
              <TextField
                name='name'
                fullWidth
                label='Listing Name'
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                ref={register('name', {
                  required: true,
                })}
              />
              <Box>
                {errors.name && errors.name.type === 'required' && (
                  <span className='error-message'>This is required field</span>
                )}
              </Box>
            </div>
            <div className='add-item-input' style={{ marginBottom: '20px' }}>
              <TextField
                fullWidth
                label='Listing Description'
                name='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                inputRef={register('description', {
                  required: true,
                  minLength: 50,
                })}
              />
              <Box>
                {'description' in errors &&
                  errors.description.type === 'required' && (
                    <span className='error-message'>This is required field</span>
                  )}
                {'description' in errors &&
                  errors.description.type === 'minLength' && (
                    <span className='error-message'>
                      Description must have 50+ characters
                    </span>
                  )}
              </Box>
            </div>

            <div className='add-item-input'>
              <FormControl fullWidth>
                <InputLabel htmlFor='category-select'>Category</InputLabel>
                <Select
                  fullWidth
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  input={<OutlinedInput label='Category' />}
                >
                  {categories_tabs.map((tab) => (
                    <MenuItem key={tab.id} value={tab.label}>
                      <ListItemText primary={tab.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className='delivery-section'>
              {/* Delivery Time or Pickup Address inputs based on the deliveryPickupOption */}
            </div>
            <div
              className='delivery-pickup-input'
              style={{ marginBottom: '20px' }}
            >
              <RadioGroup
                name='delivery-pickup'
                value={deliveryPickupOption}
                onChange={handleRadioDeliveryPickup}
                style={{display: 'inline'}}
              >
                <FormControlLabel
                  value='delivery'
                  control={<Radio />}
                  label='Delivery'
                />
                <FormControlLabel
                  value='pickup'
                  control={<Radio />}
                  label='Pickup'
                />
              </RadioGroup>
            </div>
            <section style={{ textAlign: 'center', marginTop: '20px' }}>
              {(() => {
                if (deliveryPickupOption === 'delivery') {
                  return (
                    <div
                      className='delivery-time'
                      style={{ marginBottom: '20px' }}
                    >
                      <TextField
                        min='1'
                        fullWidth
                        label='Delivery Within (days)'
                        value={deliveryTime}
                        type='number'
                        onChange={(e) => setDeliveryTime(e.target.value)}
                      />
                    </div>
                  );
                }
              })()}
              {(() => {
                if (deliveryPickupOption === 'pickup') {
                  return (
                    <div
                      className='pickup-address'
                      style={{ marginBottom: '20px' }}
                    >
                      <TextField
                        min='1'
                        fullWidth
                        label='Pickup Address'
                        value={pickupAddress}
                        type='number'
                        onChange={(e) => setPickupAddr(e.target.value)}
                        defaultValue={renderAddress()}
                      />
                    </div>
                  );
                }
              })()}

            </section>

            <div className='items-section'>
              {/* Iterate over items and render each one with editing capabilities */}
            </div>

            <div className='add-item-input' style={{ marginBottom: '20px' }}>

            {/* Display image previews */}
            <Grid container spacing={2}>
            {imagePreviews.map((preview, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                    <CardContent>
                    <img
                        src={preview}
                        alt={`image-${index}`}
                        style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'contain',
                        }}
                    />
                    <TextField
                            fullWidth
                            // label='Item Name'
                            margin='normal'
                            onChange={(e) =>
                            handleImageDetailsChange(index, 'name', e.target.value)
                            }
                            value={items[index].name}
                        />
                    <TextField
                            fullWidth
                            margin='normal'
                            onChange={(e) =>
                            handleImageDetailsChange(index, 'description', e.target.value)
                            }
                            value={items[index].description}
                        />
                        <TextField
                            fullWidth
                            type='number'
                            margin='normal'
                            onChange={(e) =>
                            handleImageDetailsChange(index, 'price', e.target.value)
                            }
                            value={items[index].price}
                        />
                        <TextField
                            fullWidth
                            type='number'
                            margin='normal'
                            onChange={(e) =>
                            handleImageDetailsChange(index, 'quantity', e.target.value)
                            }
                            value={items[index].quantity}
                        />
                        <FormControl fullWidth margin='normal'>
                        <InputLabel>Category</InputLabel>
                        <Select
                            // labelId='multiple-checkbox-label2'
                            // id='multiple-checkbox2'
                            input={<OutlinedInput label='Category' />}
                            value={items[index].category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                                handleImageDetailsChange(index, 'category', e.target.value.toLowerCase());
                            }
                            }
                        >
                            {categories_tabs.map((name) => (
                            <MenuItem key={name} value={name}>
                                <ListItemText primary={name} />
                            </MenuItem>
                            ))}
                            <MenuItem value='other'>Other</MenuItem>
                        </Select>
                        </FormControl>
                    
                    </CardContent>
                </Card>
                </Grid>
            ))}
            </Grid>

            </div>

            <Button type='submit' variant='contained'>
              Save Changes
            </Button>
          </form>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default DisplayListingPage;
