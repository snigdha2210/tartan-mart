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
  OutlinedInput,
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

const WhiteBorderTextField = styled(TextField)`
  & label.Mui-focused {
    color: #c41230;
  }
  & .MuiOutlinedInput-root {
    & fieldset {
      border-color: #c41230; /* Default border color */
    }
    &.Mui-focused fieldset {
      border-color: #c41230; /* Border color when focused */
    }
  }
`;

const RedBorderSelect = styled(Select)`
  & .MuiOutlinedInput-notchedOutline {
    border-color: #c41230; /* Default border color */
  }
  &:hover .MuiOutlinedInput-notchedOutline {
    border-color: #c41230; /* Border color on hover */
  }
  &.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: #c41230; /* Border color when focused */
  }
  & .MuiInputLabel-root {
    color: #c41230; /* Change label color */
  }
  & .MuiInputLabel-root .Mui-focused .Mui-checked .MuiRadio-checked {
    color: #c41230;
  }
`;

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

  const { my_listings, profile } = useSelector(state => {
    return state.profile;
  });

  const { username, email, isLoggedIn } = useSelector(state => {
    return state.auth;
  });

  const [pickupAddress, setPickupAddr] = useState(renderAddress());

  const [previewUrl, setPreviewUrl] = useState(null);

  const [items, setItems] = useState([]);

  const [labelColor, setLabelColor] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  //   const listingId = match.params.id;
  const { listingId } = useParams();

  const handleImageDetailsChange = (index, field, value) => {
    const updatedItems = items.map((item, idx) =>
      index === idx ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);
  };

  const handleLabelColor = () => {
    setLabelColor('#C41230');
  };

  const handleImageChange = event => {
    const files = Array.from(event.target.files);
    const newItems = files.map(file => ({
      image: file,
      price: '',
      quantity: '',
      category: '',
      description: '',
    }));

    setItems([...items, ...newItems]);

    const newImagePreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newImagePreviews]);
  };

  useEffect(() => {
    // Fetch existing listing data
    const fetchListingData = async () => {
      try {
        const response = await getRequestAuthed(
          `${API_ENDPOINTS.getListing}${listingId}`
        );
        const listing = response;
        // console.log("LISTING:" + JSON.stringify(listing));
        setItemName(listing.name);
        setDescription(listing.description);
        setDeliveryPickupOption(listing.delivery_or_pickup);
        setItems(listing.listing_item);
        // console.log("ITEMS:" + JSON.stringify(listing.listing_item));
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

  const handleFormSubmit = async e => {
    e.preventDefault();

    try {
      validateFormData();
      console.log('VALID FORM');
      const listingData = {
        name: itemName,
        description: description,
        delivery_or_pickup: deliveryPickupOption,
      };
      if (deliveryPickupOption === 'delivery') {
        listingData['delivery'] = deliveryTime;
      } else {
        listingData['pickup_address'] = pickupAddress;
      }
      console.log('CHECKPOINT 2');
      // console.log("ITEMS:" + JSON.stringify(items));
      function convertToNewObject(items) {
        const promises = items.map(item => {
          console.log('RESOLVING ITEM:' + JSON.stringify(item));
          if (item.image.name) {
            // if (!item.image.toString().includes('s3')) {
            const reader = new FileReader();

            return new Promise(resolve => {
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
            // }
          } else {
            return Promise.resolve(item);
          }
        });

        return Promise.all(promises);
      }

      convertToNewObject(items).then(async newItems => {
        console.log('CHECKPOINT 3');
        listingData['listing_item'] = newItems;
        await handlePutRequest(JSON.stringify(listingData));
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

  const handlePutRequest = async body => {
    console.log('SENDING PUT REQUEST');
    try {
      const response = await putRequest(
        `${API_ENDPOINTS.updateListing}/${listingId}`,
        body,
        'application/json'
      );
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

  const handleRadioDeliveryPickup = event => {
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
        name=""
      />
      <Box
        display="flex"
        flexDirection="row"
        justifyContent={'center'}
        // alignItems="center"
        padding="20px"
        borderRadius="8px"
        boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
        backgroundColor={theme.primary.red}
        color="#fff"
        marginLeft={5}
        marginRight={5}
        marginTop={2}
        marginBottom={5}
      >
        {' '}
        <div className="page-title-text">Edit Listing</div>
      </Box>
      <Alert severity="error" sx={{ display: errorDisplay }}>
        {errorMessage}
      </Alert>
      <Card
        className="add-item-page"
        style={{
          // overflow: 'scroll',
          padding: '20px',
          // borderRadius: '8px',
          // border: '2px solid #ccc',
          maxWidth: '1000px',
          height: '100%',
          width: '100%',
          margin: 'auto',
        }}
      >
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="add-item-input" style={{ marginBottom: '20px' }}>
            <WhiteBorderTextField
              name="name"
              fullWidth
              label="Listing Name"
              value={itemName}
              onChange={e => setItemName(e.target.value)}
              ref={register('name', {
                required: true,
              })}
            />
            <Box>
              {errors.name && errors.name.type === 'required' && (
                <span className="error-message">This is required field</span>
              )}
            </Box>
          </div>
          {/* <div className='add-item-input' style={{ marginBottom: '20px' }}>
              <WhiteBorderTextField
                fullWidth
                label='Listing Description'
                name='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                inputRef={register('description', {
                  required: true,
                  minLength: 50,
                })}
                multiline
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
            </div> */}

          <div
            className="delivery-pickup-input"
            style={{ marginBottom: '20px' }}
          >
            <RadioGroup
              name="delivery-pickup"
              value={deliveryPickupOption}
              onChange={handleRadioDeliveryPickup}
              style={{ display: 'inline' }}
            >
              <FormControlLabel
                value="delivery"
                control={
                  <Radio
                    sx={{
                      '&, &.Mui-checked': {
                        color: theme.primary.red,
                      },
                    }}
                  />
                }
                label="Delivery"
              />
              <FormControlLabel
                value="pickup"
                control={
                  <Radio
                    sx={{
                      '&, &.Mui-checked': {
                        color: theme.primary.red,
                      },
                    }}
                  />
                }
                label="Pickup"
              />
            </RadioGroup>
          </div>

          <section style={{ textAlign: 'center', marginTop: '20px' }}>
            {(() => {
              if (deliveryPickupOption === 'delivery') {
                return (
                  <div
                    className="delivery-time"
                    style={{ marginBottom: '20px' }}
                  >
                    <WhiteBorderTextField
                      min="1"
                      fullWidth
                      label="Delivery Within (days)"
                      value={deliveryTime}
                      type="number"
                      onChange={e => setDeliveryTime(e.target.value)}
                    />
                  </div>
                );
              }
            })()}
            {(() => {
              if (deliveryPickupOption === 'pickup') {
                return (
                  <div
                    className="pickup-address"
                    style={{ marginBottom: '20px' }}
                  >
                    <WhiteBorderTextField
                      min="1"
                      fullWidth
                      label="Pickup Address"
                      value={pickupAddress}
                      type="text"
                      onChange={e => setPickupAddr(e.target.value)}
                      defaultValue={renderAddress()}
                    />
                  </div>
                );
              }
            })()}
          </section>

          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            style={{
              background: 'white',
              margin: '5px',
              color: theme.primary.red,
              borderColor: theme.primary.red,
              borderWidth: 1,
              borderStyle: 'solid',
              boxShadow: 'none',
            }}
          >
            Add Items
            <VisuallyHiddenInput
              type="file"
              onChange={e => {
                handleImageChange(e);
                console.log('ITEMS:' + JSON.stringify(items));
              }}
              multiple
              ref={myref}
              accept="image/png, image/jpg, image/jpeg"
              id="image-upload"
            />
          </Button>

          <div className="add-item-input" style={{ marginBottom: '20px' }}>
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
                      <WhiteBorderTextField
                        fullWidth
                        label={'Item Name'}
                        margin="normal"
                        value={items[index].name}
                        onChange={e =>
                          handleImageDetailsChange(
                            index,
                            'name',
                            e.target.value
                          )
                        }
                      />
                      <WhiteBorderTextField
                        fullWidth
                        label={'Item Description'}
                        margin="normal"
                        value={items[index].description}
                        onChange={e =>
                          handleImageDetailsChange(
                            index,
                            'description',
                            e.target.value
                          )
                        }
                      />
                      <WhiteBorderTextField
                        fullWidth
                        label={'Price'}
                        type="number"
                        margin="normal"
                        value={items[index].price}
                        onChange={e =>
                          handleImageDetailsChange(
                            index,
                            'price',
                            e.target.value
                          )
                        }
                      />
                      <WhiteBorderTextField
                        fullWidth
                        label={'Quantity'}
                        type="number"
                        margin="normal"
                        value={items[index].quantity}
                        onChange={e =>
                          handleImageDetailsChange(
                            index,
                            'quantity',
                            e.target.value
                          )
                        }
                      />
                      <FormControl fullWidth margin="normal">
                        <InputLabel id="multiple-checkbox-label">
                          Category
                        </InputLabel>
                        <RedBorderSelect
                          input={<OutlinedInput label="Category" />}
                          // InputLabelProps={{
                          //   style: { color: labelColor,  }, // Change label color
                          // }}
                          value={
                            items[index].category.charAt(0).toUpperCase() +
                            items[index].category.substring(1).toLowerCase()
                          }
                          onChange={e => {
                            setCategory(e.target.value);
                            handleImageDetailsChange(
                              index,
                              'category',
                              e.target.value.toLowerCase()
                            );
                          }}
                        >
                          {categories_tabs.map(name => (
                            <MenuItem key={name} value={name}>
                              <ListItemText primary={name} />
                            </MenuItem>
                          ))}
                          <MenuItem value="other">Other</MenuItem>
                        </RedBorderSelect>
                      </FormControl>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>

          <Button
            variant="contained"
            onClick={handleFormSubmit}
            sx={{
              backgroundColor: theme.primary.red,
              ':hover': {
                bgcolor: 'pink', // theme.palette.primary.main
                color: 'white',
              },
              marginRight: 2,
            }}
          >
            Save Changes
          </Button>
        </form>
      </Card>
      <Footer />
    </>
  );
};

export default DisplayListingPage;
