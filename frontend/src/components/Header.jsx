// import necessary libraries and object
import React from 'react';
import { Box, Button } from '@mui/material';
import '@fontsource/inter';
import { useNavigate } from 'react-router-dom';
// import { theme } from '../../theme.js';
import '../assets/Header.css';
import { useTheme } from '@emotion/react';

// URL of the header image stored in an S3 bucket
const image =
  'https://cmumarketplace.s3.us-east-2.amazonaws.com/static/shopping-hero.svg';

// defines the header functional component
const Header = () => {
  // hook to navigate programmatically within the app
  const navigateTo = useNavigate();
  const theme = useTheme();

  // returns the Header component
  return (
    <div
      style={{
        width: '100%',
        height: '70vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          height: '90vh',
          width: '100%',
          marginBottom: '30px',
        }}
      >
        <Box
          className="hero-section-image"
          sx={{
            width: { xs: '100%', md: '50%' },
            height: '100%',
          }}
        >
          <img src={image} height="100%" width="100%" alt="Shopping Hero" />
        </Box>
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '20px',
            textAlign: 'left',
          }}
        >
          <h1>Find anything on TartanMart</h1>
          <p style={{ padding: '5px' }}>
            A marketplace for the students by the students
          </p>
          <Button
            className="btn btn-outline-primary"
            style={{
              backgroundColor: theme.primary.red,
              color: 'white',
              marginTop: '10px',
              fontFamily: 'Inter',
              cursor: 'pointer',
              width: '200px',
              borderRadius: '10px',
              height: '40px',
            }}
            onClick={() =>
              navigateTo('/listings', { state: { categories: [] } })
            }
          >
            Explore Now
          </Button>

          <Button
            className="btn button"
            style={{
              background: 'white',
              color: theme.primary.red,
              marginTop: '10px',
              fontFamily: 'Inter',
              cursor: 'pointer',
              width: '200px',
              borderRadius: '10px',
              height: '40px',
            }}
            onClick={() => navigateTo('/add-item')}
          >
            List Items
          </Button>
        </Box>
      </Box>
    </div>
  );
};

// exports the header component
export default Header;
