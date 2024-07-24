// import necessary libraries and objects
import * as React from 'react';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import IconButton from '@mui/material/IconButton';
import LoginButton from './LoginButton';
import { useState } from 'react';
import LoginIcon from '@mui/icons-material/Login';
import { styled } from '@mui/system';

// defines the clickpopup functional component with 'login' as a prop
export default function ClickPopup({ login }) {
  // state variables
  const [anchor, setAnchor] = useState(null);
  const [formData, _] = useState({
    email: '',
    password: '',
  });

  // destructuring to extract email and password from formData
  const { email, password } = formData;

  // function to handle form submission and toggle popup visibility
  const handlingSubmit = (e) => {
    e.preventDefault();
    setAnchor(anchor ? null : e.currentTarget);
    login(email, password);
  };

  // function to handle button click to toggle popup visibility
  const handleClick = (event) => {
    setAnchor(anchor ? null : event.currentTarget);
  };

  // determines if the popup is open
  const open = Boolean(anchor);
  const id = open ? 'simple-popper' : undefined;

  // returns the ClickPopup component
  return (
    <>
      <IconButton onClick={handleClick} sx={{ p: 0 }}>
        <LoginIcon />
      </IconButton>
      <BasePopup id={id} open={open} anchor={anchor}>
        <PopupBody>
          <form method='POST' onSubmit={(e) => handlingSubmit(e)}>
            <LoginButton />
          </form>
        </PopupBody>
      </BasePopup>
    </>
  );
}

// styled component for the popup body
const PopupBody = styled('div')(
  ({ theme }) => `
    width: max-content;
    padding: 12px 16px;
    margin: 8px;
    border-radius: 8px;
    border: 1px solid ${theme.primary.grey};
    background-color: white;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
  `
);
