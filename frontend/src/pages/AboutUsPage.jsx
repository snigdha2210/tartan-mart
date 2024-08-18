import React from 'react';
import NavBar from '../components/Nav';
import Footer from '../components/Footer';
import { Card, Container, Typography, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import '@fontsource/inter';
import '../assets/AboutUsPage.css';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Link from '@mui/material/Link';

//background image 
const image =
  'https://cmumarketplace.s3.us-east-2.amazonaws.com/static/about-us.svg';

// About Us Page component
const AboutUsPage = () => {

  // Retrieve user authentication status and details using Redux
  const { username, email, isLoggedIn } = useSelector((state) => {
    return state.auth;
  });

  // Define team members data
  const teamMembers = [
    {
      name: 'Jainam Gala',
      andrewId: 'jgala',
      linkedInUrl: 'https://www.linkedin.com/in/jainam-gala-278b9b1b3/',
    },
    {
      name: 'Snigdha Tiwari',
      andrewId: 'snigdhat',
      linkedInUrl: 'https://www.linkedin.com/in/snigdhat/',
    },
    {
      name: 'Sanah Imani',
      andrewId: 'simani',
      linkedInUrl: 'https://www.linkedin.com/in/sanah-imani-82ab66179/',
    },
  ];
  return (
    <>
      <NavBar
        loggedIn={isLoggedIn}
        accountDetails={{ username: username, email: email }}
        name='About Us'
      />
      <div className='about-us-page'>
        <Container maxWidth='md'>
          <div className='about-project'>
            <div
              style={{
                width: '100%',
                height: '40vh',
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
                  className='hero-section-image'
                  sx={{
                    width: { xs: '100%', md: '50%' },
                    height: '100%',
                  }}
                >
                  <img src={image} height='100%' width='100%' />
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
                  <Typography variant='h4'>TartanMart</Typography>
                  <br />
                  <Typography variant='body2' gutterBottom>
                    This is a dynamic web application that intends to serve as a
                    student-friendly platform for buying/selling items between
                    students. Students will be able to more likely find
                    school-specific items, usually at cheaper resell prices with
                    quicker delivery/pickup cycles! The intended clients for
                    this project are web app users of CMU.
                  </Typography>
                </Box>
              </Box>
            </div>
          </div>
        </Container>
        <div className='team'>
          <div className='team-title'>
            <Typography variant='h6' gutterBottom>
              Contributors
            </Typography>
          </div>
          <hr width='100px' className='centered-hr' />
          <br />
          <div className='team-members'>
            {teamMembers.map((member, index) => (
              <Card key={index} className='member-card'>
                <h3>{member.name}</h3>
                <p>{member.andrewId}@andrew.cmu.edu</p>
                <Link
                  href={member.linkedInUrl}
                  target='_blank'
                  rel='noreferrer'
                >
                  <LinkedInIcon />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AboutUsPage;
