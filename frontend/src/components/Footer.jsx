// import necessary libraries and objects
import React from 'react';
import { Container, Grid, Typography } from '@mui/material';
import '../assets/Footer.css';

// defines the footer functional component
const Footer = () => {
  // returns the footer component
  return (
    <footer className="footer">
      <Container>
        <Grid
          container
          spacing={3}
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">About Us</Typography>
            <Typography variant="body1">
              Exclusive Marketplace for CMU students.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Contact Us</Typography>
            <Typography variant="body1">
              Email: webdev@andrew.cmu.edu
            </Typography>
            <Typography variant="body1">Phone: +1234567890</Typography>
          </Grid>
        </Grid>
        <Typography variant="body2" className="copyright">
          &copy; 2024 TartanMart. All rights reserved.
        </Typography>
      </Container>
    </footer>
  );
};

// exports the footer component
export default Footer;
