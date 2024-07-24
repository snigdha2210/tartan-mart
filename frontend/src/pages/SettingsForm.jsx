import React, { useState } from 'react';
import { useTheme } from '@emotion/react';
import { TextField } from '@mui/material';
import { Button, Alert } from '@mui/material';
import { getRequestAuthed, putRequest } from '../util/api';
import API_ENDPOINTS from '../constants/apiEndpoints';
import { useDispatch } from 'react-redux';
import { updateProfile } from '../store/actions/actions.jsx';

const SettingForm = ({ profile }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);
  const [editButtonText, setEditButtonText] = useState('Edit');
  const [mobile, setMobileInput] = useState(profile.mobile);
  const [email, setEmailInput] = useState(profile.email);
  const [address, setAddress] = useState(profile.address);

  const [errorMessage, setErrorMessage] = useState('');
  const [errorDisplay, setErrorDisplay] = useState('none');

  function validateSettings(data) {
    const phoneRegex = /^\d{10}$/;
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (
      data.get('mobile') != '' &&
      data.get('mobile') != null &&
      !data.get('mobile').match(phoneRegex)
    ) {
      throw new Error('Invalid mobile number provided');
    }
    if (
      data.get('email_contact') != '' &&
      data.get('email_contact') != null &&
      !data.get('email_contact').match(emailRegex)
    ) {
      throw new Error('Invalid email contact provided');
    }
    return;
  }
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (mobile != null) {
      formData.append('mobile', mobile);
    }

    if (address != null) {
      formData.append('address', address);
    }

    try {
      validateSettings(formData);
    } catch (e) {
      setErrorDisplay('show');
      setErrorMessage(e.toString());
      return;
    }

    var formPayload = {};
    formData.forEach((value, key) => (formPayload[key] = value));
    handlePutRequest(formPayload);
  };

  const handlePutRequest = async (body) => {
    try {
      const response = await putRequest(
        API_ENDPOINTS.updateProfileSettings,
        body,
        false
      );
      if (response) {
        try {
          const data = await getRequestAuthed(API_ENDPOINTS.getProfile);
          dispatch(updateProfile(data['profile']));
        } catch (e) {
          console.error('Error in PUT request:', e);
          setErrorDisplay('show');
          if (e.message) {
            setErrorMessage(e.message);
          }
        }
      }
      setErrorMessage('');
      setErrorDisplay('none');
    } catch (e) {
      console.error('Error in PUT request:', e);
      if (e.message) {
        setErrorMessage(e.message);
      }
      setErrorDisplay('show');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    handleFormSubmit(e);
  };

  const handleEditSaveClick = (e) => {
    setEditMode(!editMode);
    if (editMode) {
      handleSave(e);
    }
    setEditButtonText(editMode ? 'Edit' : 'Save');
  };

  return (
    <div
      className='settings-page'
      style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}
    >
      <Alert sx={{ display: errorDisplay }} severity='error'>
        {errorMessage}
      </Alert>
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          className='mobile-input'
          style={{ marginBottom: '20px', width: '100%' }}
        >
          <TextField
            label='Mobile Number'
            value={mobile != null ? mobile : ''}
            disabled={!editMode}
            onChange={(e) => {
              setMobileInput(e.target.value);
              console.log('updated mobile input', mobile);
            }}
            fullWidth
          />
        </div>
        <div
          className='contact-email-input'
          style={{ marginBottom: '20px', width: '100%' }}
        >
          <TextField
            label='Email Contact'
            value={email != null ? email : ''}
            disabled={true}
            onChange={(e) => setEmailInput(e.target.value)}
            fullWidth
          />
        </div>
        <div
          className='saved-address'
          style={{ marginBottom: '20px', width: '100%' }}
        >
          <TextField
            label='Pickup/Delivery Address'
            value={address != null ? address : ''}
            disabled={!editMode}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
          />
        </div>

        <div className='save-input' style={{ textAlign: 'center' }}>
          <Button
            variant='contained'
            style={{ background: theme.primary.red }}
            onClick={handleEditSaveClick}
          >
            {editButtonText}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettingForm;
