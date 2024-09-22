import '../App.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import { useState } from 'react';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box } from '@mui/material';
import TabGroup from './TabGroup';
import ClickPopup from './ClickPopup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { theme } from '../../theme';
import { clearData } from '../store/actions/clearStore.jsx';

import '@fontsource/inter';

const pages = ['Home', 'About Us', 'Products'];
const settingsLogIn = ['Log In'];
/* removing order features for live version */
// const settings = ['Profile', 'My Orders', 'Sell', 'Logout'];
const settings = ['Profile', 'Sell', 'Logout'];

const showShoppingCart = false;

function getSettings(loggedIn) {
  if (loggedIn) {
    return settings;
  } else {
    return settingsLogIn;
  }
}

const NavBar = ({ loggedIn, accountDetails, name }) => {
  const [itemCount, updateItemCount] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [active, setActive] = useState(name);

  const dispatch = useDispatch();

  const { picture } = useSelector(state => {
    return state.auth;
  });

  const navigateTo = useNavigate();

  function handleTabClick(type) {
    setActive(type);
    if (type === 'Home') {
      navigateTo('/home');
    } else if (type === 'About Us') {
      navigateTo('/about-us');
    } else if (type === 'Products') {
      navigateTo('/listings', { state: { categories: [] } });
    }
  }

  const handleCloseUserMenu = setting => {
    setAnchorElUser(null);
    if (setting === 'Profile') {
      navigateTo('/my-profile');
      /* removing order features for live version */
      // } else if (setting === 'My Orders') {
      //   navigateTo('/my-profile', { state: { active: 'Purchased Orders' } });
    } else if (setting === 'Sell') {
      navigateTo('/add-item');
    } else if (setting === 'Logout') {
      clearData(dispatch);
      navigateTo('/home');
    }
  };

  const handleShoppingCartClick = () => {
    navigateTo('/checkout');
  };

  const handleOpenUserMenu = event => {
    setAnchorElUser(event.currentTarget);
  };

  return (
    <AppBar
      style={{
        background: 'white',
        borderBottom: '0px solid black',
        borderRadius: '0px',
        marginBottom: '10px',
      }}
      position="static"
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            noWrap
            component="a"
            sx={{
              flexGrow: 1,
              fontFamily: 'Inter',
              fontWeight: 700,
              color: '#3b3b3b',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
            onClick={() => handleTabClick('Home')}
          >
            T A R T A N &#xB7; M A R T
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <TabGroup
              types={pages}
              active={active}
              clickHandler={handleTabClick}
            ></TabGroup>
          </Box>
          <Box>
            {/* Hide shopping cart */}
            {showShoppingCart ? (
              <Tooltip title="Shopping Cart">
                <IconButton sx={{ ml: 2 }} onClick={handleShoppingCartClick}>
                  <Badge color="secondary" badgeContent={itemCount}>
                    <ShoppingCartIcon
                      sx={{ color: theme.primary.coolGray, fontSize: '30px' }}
                    />
                  </Badge>
                </IconButton>
              </Tooltip>
            ) : (
              <></>
            )}

            {loggedIn ? (
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    sx={{ fontSize: '30px' }}
                    src={picture}
                    imgProps={{ referrerPolicy: 'no-referrer' }}
                  />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Login">
                <ClickPopup />
              </Tooltip>
            )}
          </Box>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {getSettings(loggedIn).map(setting => (
              <MenuItem
                key={setting}
                onClick={() => handleCloseUserMenu(setting)}
              >
                <Typography textAlign="center" fontFamily={'Inter'}>
                  {setting}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
