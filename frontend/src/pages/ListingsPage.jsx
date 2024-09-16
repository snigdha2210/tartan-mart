import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
  ListItemText,
  Button,
  TextField,
  Box,
  Chip,
  Typography
} from '@mui/material';
import ItemCard from '../components/ItemCard';
import Loader from '../components/Loader';
import '../assets/ListingsPage.css';
import Footer from '../components/Footer.jsx';
import { useTheme } from '@emotion/react';
import { useSelector, useDispatch } from 'react-redux';
import NavBar from '../components/Nav.jsx';
import { categories_tabs } from '../constants/constants.jsx';
import { getRequestAuthed } from '../util/api';
import API_ENDPOINTS from '../constants/apiEndpoints';
import { updateItems } from '../store/actions/actions';
import { useNavigate } from 'react-router-dom';
import MuiInput from '@mui/material/Input';
import { styled } from '@mui/material/styles';

const Input = styled(MuiInput)`
  width: 42px;
`;

const WhiteBorderTextField = styled(TextField)`
  & label.Mui-focused {
    color: #C41230;
  }
  & .MuiOutlinedInput-root {
    & fieldset {
      border-color: #C41230; /* Default border color */
    }
    &.Mui-focused fieldset {
      border-color: #C41230; /* Border color when focused */
    }
  }
`;

const RedBorderSelect = styled(Select)`
  & .MuiOutlinedInput-notchedOutline {
    border-color: #C41230; /* Default border color */
  }
  &:hover .MuiOutlinedInput-notchedOutline {
    border-color: #C41230; /* Border color on hover */
  }
  &.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: #C41230; /* Border color when focused */
  }
  & .MuiInputLabel-root {
    color: #C41230; /* Change label color */
  }
  & .MuiInputLabel-root .Mui-focused {
    color: #C41230;
  }
`;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8, // Adjust the dropdown max height
      width: 'auto', // Set width to auto
    },
  },
};

const ListingsPage = (props) => {
  let location = useLocation();
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const [loading, setLoading] = useState(true);

  const [minPriceValue, setMinPriceValue] = React.useState(0);
  const [maxPriceValue, setMaxPriceValue] = React.useState(100);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleMinPriceInputChange = (event) => {
    setMinPriceValue(Number(event.target.value));
    setPriceRange([Number(event.target.value), maxPriceValue]);
  };
  const handleMaxPriceInputChange = (event) => {
    setMaxPriceValue(Number(event.target.value));
    setPriceRange([minPriceValue, Number(event.target.value)]);
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  useEffect(() => {
    const updateItemsOnListingsPage = async () => {
      try {
        const url = new URL(API_ENDPOINTS.getItems);
        url.searchParams.append('search', searchStateVar);
        url.searchParams.append(
          'category',
          categoryFilter.join(',').toLowerCase()
        );
        url.searchParams.append('minPrice', priceRange[0]);
        url.searchParams.append('maxPrice', priceRange[1]);

        const response = await getRequestAuthed(url.toString());

        if (response) {
          dispatch(updateItems(response));
        }
      } catch (error) {
        console.error('Error in POST request:', error);
      } finally {
        setLoading(false);
      }
    };

    updateItemsOnListingsPage();
  }, []);

  var categoriesDef = [];
  try {
    categoriesDef = location.state.categories;
  } catch (e) {
    console.error(e);
  }

  const { items, selectedItem } = useSelector((state) => {
    return state.items;
  });

  const [categoryFilter, setCategoryFilter] = useState(categoriesDef);
  const [searchStateVar, setSearchStateVar] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const theme = useTheme();

  const { username, email, isLoggedIn } = useSelector((state) => {
    return state.auth;
  });

  const handleSearch = async (isFilter) => {
    console.log("SEARCHING..." + searchStateVar);
    try {
      const url = new URL(API_ENDPOINTS.getItems);
      if (isFilter == true) {
        url.searchParams.append('search', searchStateVar);
        url.searchParams.append(
          'category',
          categoryFilter.join(',').toLowerCase()
        );
        url.searchParams.append('minPrice', priceRange[0]);
        url.searchParams.append('maxPrice', priceRange[1]);
      }

      const response = await getRequestAuthed(url.toString());

      if (response) {
        dispatch(updateItems(response));
      }
    } catch (error) {
      console.error('Error in search API request:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSearch(true);
  };

  const handleClearFilter = async () => {
    setCategoryFilter([]);
    setSearchStateVar('');
    setPriceRange([0, 1000]);
    setMinPriceValue(0);
    setMaxPriceValue(1000);
    await handleSearch(false);
  };

  const handleCategoryChange = (event) => {
    setCategoryFilter(event.target.value);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    setMinPriceValue(newValue[0]);
    setMaxPriceValue(newValue[1]);
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
        name='Products'
      />
          <Box
              display="flex"
              flexDirection="row"
              justifyContent={'center'}
              padding="20px"
              borderRadius="8px"
              boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
              backgroundColor={theme.primary.red}
              color='#fff'
              marginLeft={5}
              marginRight={5}
              marginBottom={5}
              marginTop={2}
            > <div className='page-title-text'>Find Products on TartanMart, Contact the Seller</div></Box>

            <Box
              display="flex"
              flexDirection="column"
              // alignItems="center"
              padding="20px"
              borderRadius="8px"
              boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
              backgroundColor="#fff"
              marginLeft={5}
              marginRight={5}
              marginBottom={5}
              marginTop={2}
            >
              <WhiteBorderTextField
                id='search-input'
                label='Search'
                variant='outlined'
                type='text'
                placeholder='Search for products...'
                value={searchStateVar}
                onChange={(e) => setSearchStateVar(e.target.value)}
                sx={{ marginBottom: 2, width: '100%' }}
              />
              <div style={{display:'flex'}}>
              <FormControl sx={{ marginBottom: 2, marginRight: 5, width: '30%'}}>
                <InputLabel id='multiple-checkbox-label'>Category</InputLabel>
                <RedBorderSelect
                  labelId='multiple-checkbox-label'
                  id='multiple-checkbox'
                  multiple
                  value={categoryFilter}
                  onChange={handleCategoryChange}
                  MenuProps={MenuProps}
                  SelectDisplayProps={{
                    style: {
                      whiteSpace: 'normal', // Prevent truncation by allowing text to wrap
                    },
                  }}
                  input={<OutlinedInput label='Category'/>}
                  InputLabelProps={{
                    style: { color: '#C41230' }, // Change label color
                  }}
                  
                  renderValue={(selected) => selected.join(', ')}
                >
                  {categories_tabs.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={categoryFilter.includes(name)} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </RedBorderSelect>
              </FormControl>
              <Box sx={{ width: '30%', marginBottom: 2 }}>
              <div style={{display:'flex', alignContent:'space-between'}}>
              <WhiteBorderTextField
                id='search-input'
                label='Min Price'
                InputLabelProps={{
                  style: { color: theme.primary.red },
                }}
                variant='outlined'
                type='number'
                placeholder='Search for products...'
                value={minPriceValue.toString()}
                onChange={handleMinPriceInputChange}
                sx={{ marginBottom: 2, marginRight:2, borderColor: '#C41230', color: '#C41230'}}
              />
              <WhiteBorderTextField
                id='search-input'
                label='Max Price'
                InputLabelProps={{
                  style: { color: theme.primary.red },
                }}
                variant='outlined'
                type='number'
                placeholder='Search for products...'
                value={maxPriceValue.toString()}
                onChange={handleMaxPriceInputChange}
                sx={{ marginBottom: 2,  }}
              />
              </div>
                {/* <Typography variant="body2" color="textSecondary" align="center">
                  ${priceRange[0]} - ${priceRange[1]}
                </Typography> */}
              </Box>
              </div>

              {/* <Chip style={{marginTop:5, marginLeft:-3, width:'auto'}} label={categoryFilter.join(', ')} variant='outlined' /> */}
              <Box display="flex" width="100%">
                <Button
                  variant='contained'
                  onClick={handleSubmit}
                  sx={{ backgroundColor: theme.primary.red, ':hover': {
                    bgcolor: 'pink', // theme.palette.primary.main
                    color: 'white',
                  }, marginRight:2 }}
                >
                  Apply Filter
                </Button>
                <Button
                  variant='outlined'
                  onClick={handleClearFilter}
                  sx={{
                    color: theme.primary.red,
                    borderColor: theme.primary.red,
                    ':hover': {
                    bgcolor: 'pink', // theme.palette.primary.main
                    color: 'white',
                    borderColor: 'pink',
                  },
                  }}
                >
                  Clear Filter
                </Button>
              </Box>
            </Box>

        {/* </div> */}
        <div className='listings-page-body'>
          <Grid container spacing={10} className='listings-grid'>
            {items.map((product) => (
              <Grid key={product.item.id} item>
                <Link
                  style={{ textDecoration: 'none' }}
                  to={`item-detail/${product.item.id}`}
                >
                  <ItemCard product={product.item} height={'180px'} />
                </Link>
              </Grid>
            ))}
          </Grid>
          {items.length === 0 && (
          <Typography variant="h6" align="center" color="textSecondary" style={{ marginTop: '100px' }}>
            No items found
          </Typography>
        )}
        </div>
      <Footer />
    </>
  );
};

export default ListingsPage;
