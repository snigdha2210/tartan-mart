// importing necessary objects and libraries
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// defines the authpopup functional component
const AuthPopup = () => {
  // state 'open' to control the visibility of the modal
  const [open, setOpen] = useState(true);

  // hook to navigate programmatically between routes
  const navigateTo = useNavigate();

  // function to close the modal and navigate to the '/home' route
  const handleClose = () => {
    setOpen(false);
    navigateTo('/home');
  };

  // styling object for the modal component
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  // returns the modal component
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style}>
        <Typography id='modal-modal-title' variant='h6' component='h2'>
          Unauthenticated.
        </Typography>
        <Typography id='modal-modal-description' sx={{ mt: 2 }}>
          Please login using your CMU Andrew ID to perform this action.
        </Typography>
      </Box>
    </Modal>
  );
};

// exports the authpopup component
export default AuthPopup;
