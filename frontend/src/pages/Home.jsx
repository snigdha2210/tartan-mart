import React from 'react';
import NavBar from '../components/Nav';
import Header from '../components/Header';
import CategoryCard from '../components/CategoryCard';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import '@fontsource/inter';
import { useSelector } from 'react-redux';
import '../assets/Home.css';
import {categories} from "../constants/constants.jsx";

const styles = {
  subheader: {
    color: '#3b3b3b',
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 30,
    fontFamily: 'Inter',
    textAlign: 'center',
    fontWeight: '800',
  },
};



const Home = () => {
  const { username, email, isLoggedIn } = useSelector((state) => {
    return state.auth;
  });

  return (
    <>
      <NavBar
        loggedIn={isLoggedIn}
        accountDetails={{ username: username, email: email }}
        name = "Home"
      />
      <Header />
      <div className='browse-product'>
        <h2 style={styles.subheader}>Browse Products</h2>
        <Grid container spacing={2} justifyContent='center'>
          {categories.map((category) => (
            <Grid key={category.id} item>
              <Link
                style={{ textDecoration: 'none' }}
                to='/listings'
                state={{ categories: [category.name] }}
              >
                <CategoryCard category={category} />
              </Link>
            </Grid>
          ))}
        </Grid>
      </div>
      <Footer />
    </>
  );
};

export default Home;
