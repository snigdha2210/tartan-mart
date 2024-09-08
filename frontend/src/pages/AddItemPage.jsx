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
import { deleteRequest, postRequest } from '../util/api';

import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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

  const { my_items, order_items, profile, my_orders } = useSelector((state) => {
    return state.profile;
  });

  const [pickupAddress, setPickupAddr] = useState(renderAddress());

  const [previewUrl, setPreviewUrl] = useState(null)

  // const [imageDetails, setImageDetails] = useState([]); // New state for image details (name, price, quantity)

  const [items, setItems] = useState([]);

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
      if (!item.image || item.image.size <= 0)
        throw new Error(`Item ${index + 1}: Invalid image`);
      if (!item.price || item.price <= 0)
        throw new Error(`Item ${index + 1}: Invalid price`);
      if (!item.quantity || item.quantity <= 0)
        throw new Error(`Item ${index + 1}: Invalid quantity`);
      // if (!item.category)
      //   throw new Error(`Item ${index + 1}: No category selected`);
      // if (!item.description || item.description.length < 30)
      //   throw new Error(`Item ${index + 1}: Invalid or too short description`);
    });
  };

  function renderAddress() {
    if (profile.address != null) {
      return profile.address;
    }
    return '';
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("TRYING TO SUBMIT");
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

      //   const newItem = {
      //           imageName: item.image.name,
      //           imageBase64: reader.result,
      //           price: item.price,
      //           quantity: item.quantity,
      //           category: item.category,
      //           description: item.description
      //         };
      // const formData = new FormData();
      // formData.append('name', itemName);
      // formData.append('description', description);
      // formData.append('delivery_or_pickup', deliveryPickupOption);

      // if (deliveryPickupOption === 'delivery') {
      //   formData.append('delivery_time', deliveryTime);
      // } else {
      //   formData.append('pickup_address', pickupAddress);
      // }
      console.log("TRYING TO SUBMIT 2");

      // Function to convert file to Base64 and transform the object
      function convertToNewObject(items) {
        const promises = items.map(item => {
          const reader = new FileReader();
          
          return new Promise((resolve) => {
            reader.onloadend = () => {
              // Creating a new object with the required structure
              const newItem = {
                name: item.name,
                image_name: item.image.name,
                image_b64: reader.result,
                price: item.price,
                quantity: item.quantity,
                category: item.category,
                description: item.description
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
        listingData['listing_item'] = newItems
        // formData.append("items", JSON.stringify(newItems));
        console.log("LISTING:", JSON.stringify(listingData));
        await handlePostRequest2(listingData);
        // clearForm();
        // Now you can use the newItems array with the desired structure
      });
      // const itemsJson = JSON.stringify(items);
      // formData.append('items', itemsJson);


      // Replace with your POST request function
      
    } catch (error) {
      setErrorDisplay('show');
      setErrorMessage(error.message);
    }
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

  const handlePostRequest2 = async (body) => {
    try {
      const response = await postRequest(API_ENDPOINTS.addListing, body, 'application/json'); // 'application/x-www-form-urlencoded'
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

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const newItems = files.map((file) => ({
      image: file,
      price: '',
      quantity: '',
      category: '',
      description: '',
    }));

    setItems([...items, ...newItems]);

    const newImagePreviews = files.map((file) => URL.createObjectURL(file));
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

  const handleDelete = (e) => {
    clearForm();
    setOpenDelete(false);
    setErrorMessage('');
    setErrorDisplay('none');
  };

  const handleImageDetailsChange = (index, field, value) => {
    const updatedItems = items.map((item, idx) =>
      index === idx ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);
  };

  useEffect(() => {
    if (!image) {
      return
    }

    const reader = new FileReader()

    reader.onloadend = () => {
      setPreviewUrl(reader.result)
    }

    reader.readAsDataURL(image)
  }, [image])

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
            {/* <div className='add-item-input' style={{ marginBottom: '20px' }}>
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
            </div> */}

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

              {/* {(() => {
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
              })()} */}
            </section>

            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              style={{
                // background: theme.primary.red,
                // // width: '100%',
                // margin: '5px',

                background: 'white',
                // width: '100%',
                margin: '5px',
                color: theme.primary.red,
                borderColor: theme.primary.red,
                borderWidth:1,
                borderStyle: 'solid',
                boxShadow: 'none'
              }}
            >
              Add Images
              <VisuallyHiddenInput
                type="file"
                onChange={(e) => {
                  handleImageChange(e);
                  // selectFiles(e);
                }}
                multiple
                ref={myref}
                accept='image/png, image/jpg, image/jpeg'
                id='image-upload'
              />
            </Button>

            {/* <div className='add-item-input' style={{ marginBottom: '20px' }}>
              <input
                accept='image/png, image/jpg, image/jpeg'
                id='image-upload'
                type='file'
                onChange={(e) => {
                  // handleImageChange(e);
                  selectFiles(e);
                }}
                ref={myref}
                multiple
              />
            </div> */}
            
            <div className='add-item-input' style={{ marginBottom: '20px' }}>
{/* 
      {imagePreviews && (
        <div>
          {imagePreviews.map((img, i) => {
            return (
              <img className="preview" src={img} alt={"image-" + i} key={i} style={{ width: '100%', height: '300px', objectFit: 'contain' }}/>
            );
          })}
        </div>
      )} */}

                  {/* Image Previews with Input Fields */}
                  {/* {imagePreviews.map((preview, index) => (
              <div key={index} style={{ marginTop: '20px' }}>

        <Card
          className='add-item-page'
          style={{
            // overflow: 'scroll',
            // padding: '20px',
            // borderRadius: '8px',
            // border: '2px solid #ccc',
            maxWidth: '1000px',
            height: '30%',
            width: '30%',
            // margin: 'auto',
            // display: 'flex'
          }}
        >
                <img src={preview} alt={`image-${index}`} style={{ width: '100%', height: '500px', objectFit: 'contain' }} />
                <TextField
                  // fullWidth
                  label='Image Name'
                  value={imageDetails[index].name}
                  onChange={(e) => handleImageDetailsChange(index, 'name', e.target.value)}
                />
                <TextField
                  // fullWidth
                  label='Price'
                  type="number"
                  value={imageDetails[index].price}
                  onChange={(e) => handleImageDetailsChange(index, 'price', e.target.value)}
                />
                <TextField
                  // fullWidth
                  label='Quantity'
                  type="number"
                  value={imageDetails[index].quantity}
                  onChange={(e) => handleImageDetailsChange(index, 'quantity', e.target.value)}
                />
                </Card>
              </div>

              
            ))} */}





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
                            label='Item Name'
                            margin='normal'
                            onChange={(e) =>
                              handleImageDetailsChange(index, 'name', e.target.value)
                            }
                          />
                      <TextField
                            fullWidth
                            label='Image Description'
                            margin='normal'
                            onChange={(e) =>
                              handleImageDetailsChange(index, 'description', e.target.value)
                            }
                          />
                          <TextField
                            fullWidth
                            label='Price'
                            type='number'
                            margin='normal'
                            onChange={(e) =>
                              handleImageDetailsChange(index, 'price', e.target.value)
                            }
                          />
                          <TextField
                            fullWidth
                            label='Quantity'
                            type='number'
                            margin='normal'
                            onChange={(e) =>
                              handleImageDetailsChange(index, 'quantity', e.target.value)
                            }
                          />
                        <FormControl fullWidth margin='normal'>
                          <InputLabel>Category</InputLabel>
                          <Select
                            // labelId='multiple-checkbox-label2'
                            // id='multiple-checkbox2'
                            input={<OutlinedInput label='Category' />}
                            value={category}
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
            <div
              className='add-item-input'
              style={{
                display: 'flex',
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              <Button
                onClick={handleOpenDelete}
                variant='contained'
                style={{
                  background: 'white',
                  width: '100%',
                  margin: '5px',
                  color: theme.primary.red,
                  borderColor: theme.primary.red,
                  borderWidth:1,
                  borderStyle: 'solid',
                  boxShadow: 'none'
                }}
              >
                Delete
              </Button>
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
