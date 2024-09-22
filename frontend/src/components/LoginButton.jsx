import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import API_ENDPOINTS from '../constants/apiEndpoints';
import { getRequestAuthed, postRequest } from '../util/api';
import { useDispatch } from 'react-redux';
import { userLogin } from '../store/actions/actions';
import { refreshProfile, updateItems } from '../store/actions/actions.jsx';
import { filterActiveSold } from '../util/profile.jsx';

const LoginButton = ({ onSuccess, onFailure }) => {
  const dispatch = useDispatch();
  const fetchProfileDataInit = async () => {
    try {
      const data = await getRequestAuthed(API_ENDPOINTS.getProfile);
      if (data) {
        let new_items = filterActiveSold(data['items']);
        dispatch(refreshProfile(data['listings'], data['profile']));
      }
    } catch (error) {
      console.error('Error in GET request:', error);
    }
  };

  const fetchItemsDataInit = async isFilter => {
    // console.log("SEARCHING..." + searchStateVar);
    try {
      const url = new URL(API_ENDPOINTS.getItems);
      if (isFilter == true) {
        url.searchParams.append('search', searchStateVar);
        url.searchParams.append(
          'category',
          categoryFilter.join(',').toLowerCase()
        );
        url.searchParams.append('minPrice', priceRange[0]);
        url.searchParams.append('maxPrice', priceRange[1]);
      }

      const response = await getRequestAuthed(url.toString());

      if (response) {
        dispatch(updateItems(response));
      }
    } catch (error) {
      console.error('Error in search API request:', error);
    }
  };

  const handlePostRequest = async body => {
    try {
      const response = await postRequest(
        API_ENDPOINTS.validateToken,
        body,
        'application/json'
      );
      if (response) {
        document.cookie = `jwt=${body.credential}; SameSite=Strict`;

        await fetchProfileDataInit();
        await fetchItemsDataInit(false);

        dispatch(userLogin(response.name, response.email, response.picture));
      }
    } catch (error) {
      console.error('Error in POST request:', error);
    }
  };

  return (
    <>
      <form>
        <GoogleLogin
          onSuccess={credentialResponse => {
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
