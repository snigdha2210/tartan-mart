export const getRequest = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.message) {
      throw new Error(`${data.message}`);
    }

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getRequestAuthed = async (url) => {
  const jwt = getCookie('jwt');
  if (jwt == null) {
    return await getRequest(url);
  }
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: 'Bearer ' + jwt,
      },
    });
    const data = await response.json();
    if (data.message) {
      throw new Error(`${data.message}`);
    }

    if (!response.ok) {
      throw new Error(`${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const putRequest = async (url, payload, contentType) => {
  try {
    const csrfToken = getCookie('csrftoken');
    const jwt = getCookie('jwt');
    let headers = {};
    let body = {};
    if (contentType) {
      headers = {
        'x-csrftoken': csrfToken,
        Authorization: 'Bearer ' + jwt,
        'Content-Type': contentType,
      };
      body = payload;
    } else {
      headers = {
        'x-csrftoken': csrfToken,
        Authorization: 'Bearer ' + jwt,
        'Content-Type': 'application/json',
      };
      body = JSON.stringify(payload);
    }
    const response = await fetch(url, {
      method: 'PUT',
      headers: headers,
      credentials: 'include',
      body: body,
    });

    const data = await response.json();
    console.log('RESPONSE FROM BACKEND:' + JSON.stringify(data));
    if (data.message) {
      throw new Error(`${data.message}`);
    }

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const postRequest = async (url, requestData, contentType) => {
  try {
    const csrfToken = getCookie('csrftoken');
    const jwt = getCookie('jwt');
    let headers = {};
    let body = {};
    if (contentType) {
      headers = {
        'x-csrftoken': csrfToken,
        'Content-Type': contentType,
        Authorization: 'Bearer ' + jwt,
      };
      body = JSON.stringify(requestData);
    } else {
      headers = {
        'x-csrftoken': csrfToken,
        Authorization: 'Bearer ' + jwt,
      };
      body = requestData;
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      // headers: {
      //   // 'Content-Type': contentType,
      //   'x-csrftoken': csrfToken,
      // },
      credentials: 'include',
      body: body,
      // body: JSON.stringify(requestData),
    });
    const data = await response.json();
    console.log('RESPONSE FROM BACKEND:' + JSON.stringify(data));
    if (data.message) {
      throw new Error(`${data.message}`);
    }
    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    return data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const deleteRequest = async (url) => {
  try {
    const csrfToken = getCookie('csrftoken');
    const jwt = getCookie('jwt');
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'x-csrftoken': csrfToken,
        Authorization: 'Bearer ' + jwt,
      },
      credentials: 'include',
    });

    const data = await response.json();
    console.log('RESPONSE FROM BACKEND:' + JSON.stringify(data));
    if (data.message) {
      throw new Error(`${data.message}`);
    }

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
};

// UTIL METHODS
export const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

var csrftoken = getCookie('csrftoken');

export const CSRFToken = () => {
  return <input type='hidden' name='csrfmiddlewaretoken' value={csrftoken} />;
};
