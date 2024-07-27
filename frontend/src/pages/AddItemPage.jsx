import React, { useState, useRef } from 'react';
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
  FormLabel,
  Alert,
  Card,
  OutlinedInput
} from '@mui/material';
import '../assets/AddItemPage.css';
import Footer from '../components/Footer.jsx';
import { useTheme } from '@emotion/react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import { categories_tabs, IMAGE_SIZE_LIMIT } from '../constants/constants.jsx';
import API_ENDPOINTS from '../constants/apiEndpoints';
import { postRequest } from '../util/api';
import { OneK } from '@mui/icons-material';

const delivery_pickup_tabs = ['Delivery', 'Pickup'];

const AddItemPage = () => {
  const theme = useTheme();
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [image, setImage] = useState(null);
  const myref = useRef();

  const [checkedDeliveryPickup, setDeliveryPickupOption] = useState('');

  const [openSubmit, setOpenSubmit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [errorDisplay, setErrorDisplay] = useState('none');
  const [errorMessage, setErrorMessage] = useState('');

  const { my_items, order_items, profile, my_orders } = useSelector((state) => {
    return state.profile;
  });

  const [pickupAddress, setPickupAddr] = useState(renderAddress());

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const handleOpenSubmit = () => {
    setOpenSubmit(true);
  };
  const handleCloseSubmit = () => {
    setOpenSubmit(false);
  };

  const handleOpenDelete = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  function validateFormData(data) {
    if (data.get('name') === '') {
      throw new Error('No name set');
    }
    if (data.get('description') === '') {
      throw new Error('No description set');
    }

    if (data.get('description').length < 30) {
      throw new Error('Small description. Be more creative!');
    }

    if (data.get('price') === '' || data.get('price') < 0) {
      throw new Error('Invalid price');
    }

    if (data.get('quantity') === '' || data.get('quantity') <= 0) {
      throw new Error('Invalid quantity');
    }

    if (data.get('category') === '') {
      throw new Error('No category provided');
    }

    if (data.get('delivery_or_pickup') === '') {
      throw new Error('Delivery or pickup not set');
    }
    if (
      data.get('delivery_or_pickup') === 'delivery' &&
      (data.get('delivery_time') === null || data.get('delivery_time') === '')
    ) {
      throw new Error('Set the estimated delivery time in days');
    }

    if (
      data.get('delivery_or_pickup') === 'pickup' &&
      data['pickup_address'] === ''
    ) {
      throw new Error('Include the pickup address');
    }
    if (data.get('category') === '') {
      throw new Error('No category selected');
    }

    if (!image || image.size <= 0 || image.size >= IMAGE_SIZE_LIMIT) {
      throw new Error('Insert a valid image (likely image size issue)');
    }
    return;
  }

  function renderAddress() {
    if (profile.address != null) {
      return profile.address;
    }
    return '';
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('name', itemName);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('quantity', quantity);
    formData.append('category', category.toLowerCase());
    formData.append('delivery_or_pickup', checkedDeliveryPickup);
    formData.append('image', image);
    if (checkedDeliveryPickup === 'delivery') {
      formData.append('delivery_time', deliveryTime);
    } else if (checkedDeliveryPickup === 'pickup') {
      formData.append('pickup_address', pickupAddress);
    }

    try {
      validateFormData(formData);
    } catch (e) {
      setErrorDisplay('show');
      setErrorMessage(e.toString());
      //close modal and clear form
      setOpenSubmit(false);
      return;
    }
    // Call the function to make the POST request with the JSON body
    handlePostRequest(formData);

    //close modal and clear form
    setOpenSubmit(false);
  };

  const handleRadioDeliveryPickup = (event) => {
    setDeliveryPickupOption(event.target.value);
    if (event.target.value == 'delivery') {
      setPickupAddr(renderAddress());
    } else {
      setDeliveryTime('');
    }
  };

  const handlePostRequest = async (body) => {
    try {
      const response = await postRequest(API_ENDPOINTS.addItem, body, false); // 'application/x-www-form-urlencoded'
      if (response) {
        setErrorDisplay('none');
      }
    } catch (error) {
      console.error('Error in POST request:', error);
      setErrorDisplay('show');
      if (error.message) {
        setErrorMessage(error.message);
      }
      return;
    }
    clearForm();
  };

  const { username, email, isLoggedIn } = useSelector((state) => {
    return state.auth;
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const clearForm = () => {
    setOpenDelete(false);
    setItemName('');
    setDescription('');
    setPrice('');
    setQuantity('');
    setCategory('');
    setImage(null);
    myref.current.value = '';
    setDeliveryTime('');
    setDeliveryPickupOption('');
  };

  const handleDelete = (e) => {
    clearForm();
    setOpenDelete(false);
    setErrorMessage('');
    setErrorDisplay('none');
  };

  return (
    <>
      <NavBar
        loggedIn={isLoggedIn}
        accountDetails={{ username: username, email: email }}
        name=''
      />
      <div className='page-container'>
        <div className='page-title-text' style={{ marginBottom: '20px' }}>
          Create a Listing
        </div>
        <Alert severity='error' sx={{ display: errorDisplay }}>
          {errorMessage}
        </Alert>
        <Card
          className='add-item-page'
          style={{
            // overflow: 'scroll',
            padding: '20px',
            // borderRadius: '8px',
            // border: '2px solid #ccc',
            maxWidth: '800px',
            height: '100%',
            width: '90%',
            margin: 'auto',
          }}
        >
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className='add-item-input' style={{ marginBottom: '20px' }}>
              <TextField
                name='name'
                fullWidth
                label='Item Name'
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
                label='Description'
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
                    <span className='error-message'>
                      This is required field
                    </span>
                  )}
                {errors.description &&
                  errors.description.type === 'minLength' && (
                    <span className='error-message'>
                      Minimum characters 50 required
                    </span>
                  )}
              </Box>
            </div>
            <div className='add-item-input' style={{ marginBottom: '20px' }}>
              <TextField
                fullWidth
                oninput="validity.valid||(value='');"
                name='price'
                label='Price ($)'
                min='0'
                value={price}
                type='number'
                onChange={(e) => setPrice(e.target.value)}
                inputRef={register('price', {
                  required: true,
                })}
              />
              <Box>
                {errors.price && errors.price.type === 'required' && (
                  <span className='error-message'>This is required field</span>
                )}
              </Box>
            </div>
            <div className='add-item-input' style={{ marginBottom: '20px' }}>
              <TextField
                fullWidth
                name='quantity'
                label='Quantity'
                value={quantity}
                oninput="validity.valid||(value='');"
                min='1'
                type='number'
                onChange={(e) => setQuantity(e.target.value)}
                inputRef={register('quantity', {
                  required: true,
                })}
              />
              <Box>
                {errors.quantity && errors.quantity.type === 'required' && (
                  <span className='error-message'>This is required field</span>
                )}
              </Box>
            </div>

            <div className='add-item-input' style={{ marginBottom: '20px' }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  // labelId='multiple-checkbox-label2'
                  // id='multiple-checkbox2'
                  input={<OutlinedInput label='Category' />}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories_tabs.map((name) => (
                    <MenuItem key={name} value={name}>
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                  <MenuItem value='other'>Other</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div
              className='delivery-pickup-input'
              style={{ marginBottom: '20px' }}
            >
              <RadioGroup
                name='delivery-pickup'
                value={checkedDeliveryPickup}
                onChange={handleRadioDeliveryPickup}
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
                if (checkedDeliveryPickup === 'delivery') {
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
                if (checkedDeliveryPickup === 'pickup') {
                  return (
                    <div
                      className='pickup-address'
                      style={{ marginBottom: '20px', alignItems: 'left' }}
                    >
                      <FormControl>
                        <FormLabel>Pickup Address</FormLabel>

                        <TextField
                          fullWidth
                          label='Pickup Address'
                          value={pickupAddress}
                          defaultValue={renderAddress()}
                          type='text'
                          onChange={(e) => setPickupAddr(e.target.value)}
                        />
                      </FormControl>
                    </div>
                  );
                }
              })()}
            </section>
            <div className='add-item-input' style={{ marginBottom: '20px' }}>
              <input
                accept='image/png, image/jpg, image/jpeg'
                id='image-upload'
                type='file'
                onChange={(e) => {
                  handleImageChange(e);
                }}
                ref={myref}
              />
            </div>
            <div
              className='add-item-input'
              style={{
                display: 'flex',
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              <Button
                onClick={handleOpenSubmit}
                variant='contained'
                style={{
                  background: theme.primary.red,
                  width: '100%',
                  margin: '5px',
                }}
              >
                Submit
              </Button>
              <Modal open={openSubmit} onClose={handleCloseSubmit}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'white',
                    border: '2px solid #000',
                    boxShadow: 24,
                    borderRadius: '8px',
                  }}
                >
                  <Typography
                    id='modal-modal-description'
                    sx={{
                      mt: 2,
                      color: theme.primary.coolGray,
                      margin: 5,
                      textAlign: 'center',
                    }}
                  >
                    Are you sure you want to publish?
                  </Typography>
                  <div
                    className='confirm-submit'
                    style={{
                      display: 'flex',
                      marginBottom: '20px',
                      textAlign: 'center',
                    }}
                  >
                    <Button
                      onClick={handleFormSubmit}
                      type='submit'
                      style={{
                        background: theme.primary.red,
                        color: 'white',
                        width: '100%',
                        margin: 5,
                        height: '35px',
                      }}
                    >
                      Yes
                    </Button>
                    <Button
                      style={{
                        background: theme.primary.red,
                        color: 'white',
                        width: '100%',
                        margin: 5,
                        height: '35px',
                      }}
                      onClick={handleCloseSubmit}
                    >
                      Cancel
                    </Button>
                  </div>
                </Box>
              </Modal>

              <Button
                onClick={handleOpenDelete}
                variant='contained'
                style={{
                  background: theme.primary.red,
                  width: '100%',
                  margin: '5px',
                }}
              >
                Delete
              </Button>

              <Modal open={openDelete} onClose={handleCloseDelete}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'white',
                    border: '2px solid #000',
                    boxShadow: 24,
                    borderRadius: '8px',
                  }}
                >
                  <Typography
                    id='modal-modal-description'
                    sx={{
                      mt: 2,
                      color: theme.primary.coolGray,
                      textAlign: 'center',
                      marginTop: 5,
                    }}
                  >
                    Are you sure you want to delete?
                  </Typography>
                  <div
                    className='confirm-delete'
                    style={{
                      display: 'flex',
                      marginBottom: '20px',
                      textAlign: 'center',
                    }}
                  >
                    <Button
                      onClick={handleDelete}
                      sx={{
                        background: theme.primary.red,
                        width: '100%',
                        margin: 5,
                        height: '35px',
                        color: 'white',
                      }}
                    >
                      Yes
                    </Button>
                    <Button
                      onClick={handleCloseDelete}
                      sx={{
                        background: theme.primary.red,
                        width: '100%',
                        margin: 5,
                        height: '35px',
                        color: 'white',
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </Box>
              </Modal>
            </div>
          </form>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default AddItemPage;
