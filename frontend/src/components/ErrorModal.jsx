import React from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ErrorModal = ({ errorMessage, redirectPath }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(redirectPath);
  };

  return (
    <Modal
      open={true} // Always open
      onClose={handleClose}
      aria-labelledby="error-modal-title"
      aria-describedby="error-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" id="error-modal-title">
          Error
        </Typography>
        <Typography variant="body1" id="error-modal-description">
          {errorMessage}
        </Typography>
        {/* <Button onClick={handleClose}>Close</Button> */}
      </Box>
    </Modal>
  );
};

export default ErrorModal;
