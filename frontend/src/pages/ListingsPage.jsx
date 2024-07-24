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
  IconButton,
  TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ItemCard from '../components/ItemCard';
import Loader from '../components/Loader';
import '../assets/ListingsPage.css';
import Footer from '../components/Footer.jsx';
import { useTheme } from '@emotion/react';
import { useSelector } from 'react-redux';
import NavBar from '../components/Nav.jsx';
import { categories_tabs } from '../constants/constants.jsx';
import { getRequestAuthed } from '../util/api';
import API_ENDPOINTS from '../constants/apiEndpoints';
import { useDispatch } from 'react-redux';
import { updateItems } from '../store/actions/actions';
import { useNavigate } from 'react-router-dom';

const ListingsPage = (props) => {
  let location = useLocation();
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateItemsOnListingsPage = async () => {
      try {
        const url = new URL(API_ENDPOINTS.getItems);
        url.searchParams.append('search', searchStateVar);
        url.searchParams.append(
          'category',
          categoryFilter.join(',').toLowerCase()
        );

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
  const theme = useTheme();

  const { username, email, isLoggedIn } = useSelector((state) => {
    return state.auth;
  });

  const handleSearch = async () => {
    try {
      const url = new URL(API_ENDPOINTS.getItems);
      url.searchParams.append('search', searchStateVar);
      url.searchParams.append(
        'category',
        categoryFilter.join(',').toLowerCase()
      );

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
    await handleSearch();
  };



  const handleCategoryChange = (event) => {
    setCategoryFilter(event.target.value);
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
      <div className='listings-page'>
        <div className='listings-page-header'>
          <div className='page-title-text'>Browse...</div>
          <div className='filters-parent'>
            <div className='filter-multi-select'>
              <FormControl sx={{ m: 1, width: 200 }}>
                <InputLabel id='multiple-checkbox-label'>Category</InputLabel>
                <Select
                  labelId='multiple-checkbox-label'
                  id='multiple-checkbox'
                  multiple
                  value={categoryFilter}
                  onChange={handleCategoryChange}
                  input={<OutlinedInput label='Category' />}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {categories_tabs.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={categoryFilter.includes(name)} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>{' '}
            </div>
            <div className='search-input'>
              <TextField
                id='search-input'
                label='Search'
                variant='outlined'
                type='text'
                placeholder='Search...'
                value={searchStateVar}
                onChange={(e) => setSearchStateVar(e.target.value)}
              />
              <IconButton variant='contained' onClick={handleSubmit}>
                <SearchIcon style={{ color: theme.primary.red }} />
              </IconButton>
            </div>
          </div>
        </div>
        <div className='listings-page-body'>
          <Grid container spacing={2} className='listings-grid'>
            {items.map((product) => (
              <Grid key={product.item.id} item>
                <Link
                  style={{ textDecoration: 'none' }}
                  to={`item-detail/${product.item.id}`}
                >
                  <ItemCard
                    product={product.item}
                  />
                </Link>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ListingsPage;
