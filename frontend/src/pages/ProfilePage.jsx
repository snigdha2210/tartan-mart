import Footer from '../components/Footer.jsx';
import React, { useEffect, useState } from 'react';
import TabGroup from '../components/TabGroup.jsx';
import NavBar from '../components/Nav.jsx';

import { useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { Avatar, Grid } from '@mui/material';
import { Card } from '@mui/material';
import { useLocation, Link } from 'react-router-dom';
import { Box } from '@mui/material';
import SettingsForm from './SettingsForm.jsx';
import API_ENDPOINTS from '../constants/apiEndpoints.js';
import { getRequestAuthed } from '../util/api.jsx';
import { refreshProfile } from '../store/actions/actions.jsx';
import { useDispatch } from 'react-redux';
import { filterActiveSold } from '../util/profile.jsx';
import ListingCard from '../components/ListingCard';
import '../assets/ListingsPage.css';

const profile_tabs = [
  'Listings',
  // 'Items sold',
  // 'Purchased Orders',
  'Account Settings',
];

const ProfilePage = (props) => {
  let location = useLocation();
  const dispatch = useDispatch();
  var activeTabInit = profile_tabs[0];

  useEffect(() => {
    const updateListingsOnProfilePage = async () => {
      try {
        const url = new URL(API_ENDPOINTS.getListing);
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

    updateListingsOnProfilePage();
  }, []);

  const { items, selectedItem } = useSelector((state) => {
    return state.items;
  });

  try {
    activeTabInit = location.state.active;
  } catch (e) {
    console.error(e);
  }

  const [active, setActive] = useState(activeTabInit);
  const [editMode, _] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const { username, email, isLoggedIn, picture } = useSelector((state) => {
    return state.auth;
  });

  useEffect(() => {
    var data = {};

    const fetchProfileDataInit = async () => {
      try {
        data = await getRequestAuthed(API_ENDPOINTS.getProfile);
        if (data) {
          // let new_items = filterActiveSold(data['items']);
          dispatch(
            refreshProfile(
              data['listings'],
              data['profile'],
            )
          );

          //TODO: dispatch call to list of items
          //check json formatting in get_listing
        }
      } catch (error) {
        console.error('Error in GET request:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileDataInit();
  }, []);

  const { my_listings, profile } = useSelector((state) => {
    return state.profile;
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
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
        name=''
      />
      <div className='page-container'>
        <div className='page-title-text'>My Profile</div>
        <Card
          elevation={4}
          style={{
            padding: '20px',
            borderRadius: '8px',
            margin: '20px auto',
            maxWidth: '800px',
            width: '80%',
          }}
        >
          <div
            className='profile-page'
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div className='my-profile-input' style={{ textAlign: 'center' }}>
              <Avatar
                size='lg'
                alt='Profile'
                src={picture}
                imgProps={{
                  style: {
                    maxHeight: '100%',
                    maxWidth: '100%',
                    objectFit: 'cover',
                    alignSelf: 'center',
                  },
                }}
                sx={{ width: 100, height: 100 }}
              />
              <input
                accept='image/*'
                id='avatar-image-upload'
                type='file'
                onChange={handleImageChange}
                disabled={!editMode}
                hidden
              />
            </div>
            <section
              className='card-body'
              style={{ textAlign: 'center', marginTop: '20px' }}
            >
              <p className='card-title'> {profile.name}</p>
              <p className='card-title'>{profile.email}</p>
              <p className='card-title'>Joined on {profile.date_joined}</p>
            </section>
          </div>
          <div
            className='profile-page'
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: 30,
            }}
          >
            <TabGroup
              types={profile_tabs}
              active={active}
              clickHandler={setActive}
              style={{ textAlign: 'center', marginTop: '20px', width: '100%' }}
            />
          </div>
          <section style={{ textAlign: 'center', marginTop: '20px' }}>
            {(() => {
              if (active === profile_tabs[0]) {
                return (
                  <Box sx={{ minHeight: '5vh' }}>
                    <div className='listings-page-body'>
                      <Grid container spacing={2} className='listings-grid' justifyContent="center"> {/* Center the grid items */}
                        {my_listings.map((listing) => (
                          <Grid key={listing.id} item>
                            <ListingCard listing={listing} />
                          </Grid>
                        ))}
                      </Grid>
                    </div>
                  </Box>
                );
              } else {
                return (
                  <Box sx={{ minHeight: '50vh' }}>
                    <SettingsForm profile={profile} />
                  </Box>
                );
              }
            })()}
          </section>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
