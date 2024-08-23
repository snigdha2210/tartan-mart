import Footer from '../components/Footer.jsx';
import React, { useEffect, useState } from 'react';
import TabGroup from '../components/TabGroup.jsx';
import NavBar from '../components/Nav.jsx';

import { useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { Avatar } from '@mui/material';
import { Card } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import ItemList from '../components/ItemList.jsx';
import SettingsForm from './SettingsForm.jsx';
import API_ENDPOINTS from '../constants/apiEndpoints.js';
import { getRequestAuthed } from '../util/api.jsx';
import { refreshProfile } from '../store/actions/actions.jsx';
import { useDispatch } from 'react-redux';
import { filterActiveSold } from '../util/profile.jsx';
import OrderList from '../components/OrderList.jsx';
import PurchasesList from '../components/PurchasesList.jsx';

const profile_tabs = [
  'Listings',
  'Items sold',
  'Purchased Orders',
  'Account Settings',
];

const ProfilePage = (props) => {
  let location = useLocation();
  const dispatch = useDispatch();
  var activeTabInit = profile_tabs[0];

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
          let new_items = filterActiveSold(data['items']);
          dispatch(
            refreshProfile(
              new_items,
              data['items_order'],
              data['profile'],
              data['orders']
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

  const { my_items, order_items, profile, my_orders } = useSelector((state) => {
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
                  <Box sx={{ minHeight: '50vh' }}>
                    <ItemList
                      items={my_items}
                      withUpdate={{ archive: true, delete: false }}
                    />
                  </Box>
                );
              } else if (active === profile_tabs[1]) {
                return (
                  <Box sx={{ minHeight: '50vh' }}>
                    <OrderList order_items={order_items} />
                  </Box>
                );
              } else if (active === profile_tabs[2]) {
                return (
                  <Box sx={{ minHeight: '50vh' }}>
                    <PurchasesList purchases={my_orders} withUpdate={false} />
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
