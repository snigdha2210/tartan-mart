import React, { useState, useRef, useEffect } from 'react';
import NavBar from '../components/Nav';
import Switch from '@mui/material/Switch';
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
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import '../assets/AddItemPage.css';
import Footer from '../components/Footer.jsx';
import { useTheme } from '@emotion/react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import { categories_tabs } from '../constants/constants.jsx';
import API_ENDPOINTS from '../constants/apiEndpoints';
import { deleteRequest, postRequest } from '../util/api';

import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete'; // Import the Delete Icon

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
  & .MuiInputLabel-root .Mui-focused {
    color: #c41230;
  }
`;

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

const AddItemPage = () => {
  const theme = useTheme();
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [image, setImage] = useState(null);

  // const [selectedFiles, setSelectedFiles] = useState(null);
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

  const [pickupAddress, setPickupAddr] = useState(renderAddress());

  const [previewUrl, setPreviewUrl] = useState(null);

  // const [imageDetails, setImageDetails] = useState([]); // New state for image details (name, price, quantity)

  const [items, setItems] = useState([]);

  const [checked, setChecked] = React.useState(true);

  const [formPage, setFormPage] = useState(1);

  const handleChange = event => {
    setChecked(event.target.checked);
  };

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

  const validateFormData = () => {
    if (!itemName) throw new Error('No name set');
    // if (!description || description.length < 30)
    //   throw new Error('Invalid or too short description');
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
      if (!item.image || item.image.size <= 0)
        throw new Error(`Item ${index + 1}: Invalid image`);
      if (!item.price || item.price <= 0)
        throw new Error(`Item ${index + 1}: Invalid price`);
      if (!item.quantity || item.quantity <= 0)
        throw new Error(`Item ${index + 1}: Invalid quantity`);
    });
  };

  function renderAddress() {
    if (profile.address != null) {
      return profile.address;
    }
    return '';
  }

  const handleFormSubmit = async e => {
    e.preventDefault();

    try {
      console.log('TRYING TO SUBMIT');
      validateFormData();
      const listingData = {
        name: itemName,
        // "description": description,
        delivery_or_pickup: deliveryPickupOption,
      };
      if (deliveryPickupOption === 'delivery') {
        listingData['delivery_time'] = deliveryTime;
      } else {
        listingData['pickup_address'] = pickupAddress;
      }

      // Function to convert file to Base64 and transform the object
      function convertToNewObject(items) {
        const promises = items.map(item => {
          const reader = new FileReader();

          return new Promise(resolve => {
            reader.onloadend = () => {
              // Creating a new object with the required structure
              const newItem = {
                name: item.name,
                image_name: item.image.name,
                image_b64: reader.result,
                price: item.price,
                quantity: item.quantity,
                category: item.category,
                description: item.description,
                status: item.status,
              };
              resolve(newItem);
            };
            reader.readAsDataURL(item.image);
          });
        });

        return Promise.all(promises);
      }

      convertToNewObject(items).then(async newItems => {
        // console.log(newItems);
        listingData['listing_item'] = newItems;
        // formData.append("items", JSON.stringify(newItems));
        console.log('SENDING LISTING:', JSON.stringify(listingData));
        await handlePostRequest2(listingData);
        clearForm();
      });
    } catch (error) {
      setErrorDisplay('show');
      setErrorMessage(error.message);
    }
  };

  const handleRadioDeliveryPickup = event => {
    setDeliveryPickupOption(event.target.value);
    if (event.target.value == 'delivery') {
      setPickupAddr(renderAddress());
    } else {
      setDeliveryTime('');
    }
  };

  const handlePostRequest2 = async body => {
    try {
      const response = await postRequest(
        API_ENDPOINTS.addListing,
        body,
        'application/json'
      ); // 'application/x-www-form-urlencoded'
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

  const { username, email, isLoggedIn } = useSelector(state => {
    return state.auth;
  });

  const handleImageChange = event => {
    const files = Array.from(event.target.files);
    const newItems = files.map(file => ({
      image: file,
      price: '',
      quantity: '',
      category: '',
      description: '',
      status: 'listed',
    }));

    setItems([...items, ...newItems]);

    const newImagePreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newImagePreviews]);
  };

  const clearForm = () => {
    setItemName('');
    setDescription('');
    setDeliveryPickupOption('');
    setDeliveryTime('');
    setPickupAddr('');
    setItems([]);
    setImagePreviews([]);
    // setImageStatus([]);
    setErrorDisplay('none');
    setErrorMessage('');
    setOpenSubmit(false);
  };

  const handleDelete = e => {
    clearForm();
    setOpenDelete(false);
    setErrorMessage('');
    setErrorDisplay('none');
  };

  const handleImageDetailsChange = (index, field, value) => {
    console.log('SWITCH VALUE TURNING TO:' + value);
    const updatedItems = items.map((item, idx) =>
      index === idx ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);
  };

  const handleNext = () => {
    setFormPage(formPage + 1);
  };

  const handleBack = () => {
    setFormPage(formPage - 1);
  };

  const handleSwitchChange = (index, event) => {
    const newStatus = event.target.checked ? 'listed' : 'delisted';
    handleImageDetailsChange(index, 'status', newStatus);
  };

  const [isDelisted, setIsDelisted] = useState(false);
  const handleDelistToggle = () => {
    setIsDelisted(!isDelisted);
    // Add additional logic if you need to handle the de-listing process, like making an API call.
  };

  // Handle delete of individual image
  const handleDeleteImage = index => {
    const updatedItems = items.filter((_, idx) => idx !== index);
    const updatedPreviews = imagePreviews.filter((_, idx) => idx !== index);
    setItems(updatedItems);
    setImagePreviews(updatedPreviews);
  };

  useEffect(() => {
    if (!image) {
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };

    reader.readAsDataURL(image);
  }, [image]);

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
        <div className="page-title-text">Create a Listing ({formPage}/3)</div>
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
          {formPage == 1 ? (
            <>
              <Typography variant="h4" color="text.secondary" marginBottom={5}>
                Listing Name
              </Typography>
              <i>
                *Listing Name will only be visible to you. Only Sellers can
                manage their listings.
              </i>
              <div
                className="add-item-input"
                style={{ marginBottom: '20px', marginTop: '5px' }}
              >
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
                    <span className="error-message">
                      This is required field
                    </span>
                  )}
                </Box>
              </div>

              <div
                className="add-item-input"
                style={{
                  display: 'flex',
                  marginBottom: '20px',
                  textAlign: 'center',
                }}
              >
                <Button
                  onClick={handleNext}
                  variant="contained"
                  style={{
                    background: theme.primary.red,
                    width: '100%',
                    margin: '5px',
                  }}
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            <> </>
          )}

          {formPage == 2 ? (
            <>
              <Typography variant="h4" color="text.secondary" marginBottom={2}>
                How do buyers receive the items?
              </Typography>
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

              <div
                className="add-item-input"
                style={{
                  display: 'flex',
                  marginBottom: '20px',
                  textAlign: 'center',
                }}
              >
                <Button
                  onClick={handleBack}
                  variant="contained"
                  style={{
                    background: 'white',
                    width: '100%',
                    margin: '5px',
                    color: theme.primary.red,
                    borderColor: theme.primary.red,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    boxShadow: 'none',
                  }}
                >
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  variant="contained"
                  style={{
                    background: theme.primary.red,
                    width: '100%',
                    margin: '5px',
                  }}
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            <> </>
          )}

          {formPage == 3 ? (
            <>
              <Typography variant="h4" color="text.secondary" marginBottom={2}>
                Add your items
              </Typography>
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
                  }}
                  multiple
                  ref={myref}
                  accept="image/png, image/jpg, image/jpeg"
                  id="image-upload"
                />
              </Button>

              <div className="add-item-input" style={{ marginBottom: '20px' }}>
                <Grid container spacing={2}>
                  {imagePreviews.map((preview, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card style={{ position: 'relative' }}>
                        <CardContent>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Switch
                              checked={items[index].status === 'listed'}
                              onChange={e => handleSwitchChange(index, e)}
                              inputProps={{ 'aria-label': 'controlled' }}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: theme.primary.red,
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                                  {
                                    backgroundColor: theme.primary.red,
                                  },
                              }}
                            />
                            <DeleteIcon
                              onClick={() => handleDeleteImage(index)}
                              style={{
                                cursor: 'pointer',
                                color: theme.primary.red,
                              }}
                            />
                          </div>
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
                            label="Item Name"
                            margin="normal"
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
                            label="Item Description"
                            margin="normal"
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
                            label="Price"
                            type="number"
                            margin="normal"
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
                            label="Quantity"
                            type="number"
                            margin="normal"
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
                              InputLabelProps={{
                                style: { color: '#C41230' }, // Change label color
                              }}
                              value={items[index].category}
                              onChange={e =>
                                handleImageDetailsChange(
                                  index,
                                  'category',
                                  e.target.value
                                )
                              }
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

              <div
                className="add-item-input"
                style={{
                  display: 'flex',
                  marginBottom: '20px',
                  textAlign: 'center',
                }}
              >
                <Button
                  onClick={handleBack}
                  variant="contained"
                  style={{
                    background: 'white',
                    width: '100%',
                    margin: '5px',
                    color: theme.primary.red,
                    borderColor: theme.primary.red,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    boxShadow: 'none',
                  }}
                >
                  Back
                </Button>
                <Button
                  onClick={handleOpenSubmit}
                  variant="contained"
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
                      id="modal-modal-description"
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
                      className="confirm-submit"
                      style={{
                        display: 'flex',
                        marginBottom: '20px',
                        textAlign: 'center',
                      }}
                    >
                      <Button
                        onClick={handleFormSubmit}
                        type="submit"
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
                      id="modal-modal-description"
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
                      className="confirm-delete"
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
            </>
          ) : (
            <> </>
          )}
        </form>
      </Card>
      <Footer />
    </>
  );
};

export default AddItemPage;
