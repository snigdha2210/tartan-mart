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
  Typography,
  Paper,
  Divider,
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

const FilterBox = styled(Paper)`
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  margin-left: 40px;
  margin-right: 40px;
  margin-top: 50px;
`;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8, // Adjust the dropdown max height
      width: 'auto', // Set width to auto
    },
  },
};

const ListingsPage = props => {
  let location = useLocation();
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const [loading, setLoading] = useState(true);

  const [minPriceValue, setMinPriceValue] = React.useState(0);
  const [maxPriceValue, setMaxPriceValue] = React.useState(1000);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleMinPriceInputChange = event => {
    const value = event.target.value;
    const numericValue = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (numericValue === '') {
      setMinPriceValue(0); // Default to 0 if input is empty
    } else {
      setMinPriceValue(Number(numericValue));
    }
    setPriceRange([Number(numericValue), maxPriceValue]);
  };

  const handleMaxPriceInputChange = event => {
    const value = event.target.value;
    const numericValue = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (numericValue === '') {
      setMaxPriceValue(1000); // Default to 1000 if input is empty
    } else {
      setMaxPriceValue(Number(numericValue));
    }
    setPriceRange([minPriceValue, Number(numericValue)]);
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

  const { items, selectedItem } = useSelector(state => {
    return state.items;
  });

  const [categoryFilter, setCategoryFilter] = useState(categoriesDef);
  const [searchStateVar, setSearchStateVar] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const theme = useTheme();

  const { username, email, isLoggedIn } = useSelector(state => {
    return state.auth;
  });

  const handleSearch = async isFilter => {
    console.log('SEARCHING...' + searchStateVar);
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

  const handleSubmit = async e => {
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

  const handleCategoryChange = event => {
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
        name="Products"
      />
      <Box
        display="flex"
        flexDirection="row"
        justifyContent={'center'}
        padding="20px"
        borderRadius="8px"
        boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
        backgroundColor={theme.primary.red}
        color="#fff"
        marginLeft={5}
        marginRight={5}
        marginBottom={5}
        marginTop={2}
      >
        {' '}
        <div className="page-title-text">
          Find Products on TartanMart, Contact the Seller
        </div>
      </Box>

      <FilterBox>
        <Typography variant="h6" gutterBottom color={theme.primary.red}>
          Filter Products
        </Typography>
        <Divider sx={{ marginBottom: 3 }} />
        <Grid container spacing={3}>
          {/* Search Field */}
          <Grid item xs={12} md={4}>
            <WhiteBorderTextField
              label="Search for products..."
              variant="outlined"
              fullWidth
              value={searchStateVar}
              onChange={e => setSearchStateVar(e.target.value)}
            />
          </Grid>

          {/* Category Filter */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="multiple-checkbox-label">Category</InputLabel>
              <RedBorderSelect
                multiple
                value={categoryFilter}
                onChange={handleCategoryChange}
                input={<OutlinedInput label="Category" />}
                renderValue={selected => selected.join(', ')}
              >
                {categories_tabs.map(name => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={categoryFilter.includes(name)} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </RedBorderSelect>
            </FormControl>
          </Grid>

          {/* Price Range Fields */}
          <Grid item xs={12} md={4}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <WhiteBorderTextField
                  label="Min Price"
                  variant="outlined"
                  fullWidth
                  value={`$${minPriceValue === 0 ? '' : minPriceValue}`} // Show $ sign and handle blank input
                  onChange={handleMinPriceInputChange}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} // Ensure numeric input
                />
              </Grid>

              <Grid item xs={6}>
                <WhiteBorderTextField
                  label="Max Price"
                  variant="outlined"
                  fullWidth
                  value={`$${maxPriceValue === 1000 ? '' : maxPriceValue}`} // Show $ sign and handle blank input
                  onChange={handleMaxPriceInputChange}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} // Ensure numeric input
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ marginY: 1, width: 0 }} />

        {/* Action Buttons */}
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                backgroundColor: theme.primary.red,
                color: 'white',
                ':hover': {
                  bgcolor: 'pink',
                },
              }}
            >
              Apply Filter
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              onClick={handleClearFilter}
              sx={{
                color: theme.primary.red,
                borderColor: theme.primary.red,
                ':hover': {
                  bgcolor: 'pink',
                  color: 'white',
                  borderColor: 'pink',
                },
              }}
            >
              Clear Filter
            </Button>
          </Grid>
        </Grid>
      </FilterBox>

      <div className="listings-page-body">
        <Typography
          variant="h6"
          align="left"
          color="textSecondary"
          style={{ marginBottom: '30px' }}
        >
          Showing {items.length} results
        </Typography>
        <Grid container spacing={10} className="listings-grid">
          {items.map(product => (
            <Grid key={product.item.id} item>
              <Link
                style={{ textDecoration: 'none' }}
                to={`item-detail/${product.item.id}`}
                target="_blank"
              >
                <ItemCard product={product.item} height={'180px'} />
              </Link>
            </Grid>
          ))}
        </Grid>
        {items.length === 0 && (
          <Typography
            variant="h6"
            align="center"
            color="textSecondary"
            style={{ marginTop: '100px' }}
          >
            No items found
          </Typography>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ListingsPage;
