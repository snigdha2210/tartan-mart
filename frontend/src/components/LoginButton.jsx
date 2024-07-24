import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import API_ENDPOINTS from '../constants/apiEndpoints';
import { getRequestAuthed, postRequest } from '../util/api';
import { useDispatch } from 'react-redux';
import { userLogin } from '../store/actions/actions';
import { refreshProfile } from '../store/actions/actions.jsx';
import { filterActiveSold } from '../util/profile.jsx';

const LoginButton = ({ onSuccess, onFailure }) => {
  const dispatch = useDispatch();
  const fetchProfileDataInit = async () => {
    try {
      const data = await getRequestAuthed(API_ENDPOINTS.getProfile);
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
      }
    } catch (error) {
      console.error('Error in GET request:', error);
    }
  };

  const handlePostRequest = async (body) => {
    try {
      const response = await postRequest(
        API_ENDPOINTS.validateToken,
        body,
        'application/json'
      );
      if (response) {
        document.cookie = `jwt=${body.credential}; SameSite=Strict`;
        dispatch(userLogin(response.name, response.email, response.picture));
        fetchProfileDataInit();
      }
    } catch (error) {
      console.error('Error in POST request:', error);
    }
  };

  return (
    <>
      <form>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            handlePostRequest(credentialResponse);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </form>
    </>
  );
};

export default LoginButton;
