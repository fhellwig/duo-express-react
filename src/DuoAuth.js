/*
 * MIT License
 *
 * Copyright (c) 2020 Frank Hellwig
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import React, { useContext, useReducer, useEffect, useRef } from 'react';
import axios from 'axios';
import Duo from './Duo-Web-v2';
import './DuoAuth.css';

const DUO_ENDPOINT = '/duo';

//------------------------------------------------------------------------------
// Context and the useDuoAuth convenience function
//------------------------------------------------------------------------------

const DuoAuthContext = React.createContext();

export function useDuoAuth() {
  return useContext(DuoAuthContext);
}

//------------------------------------------------------------------------------
// Reducer and associated action types
//------------------------------------------------------------------------------

export const actionTypes = {
  SET_USERNAME: 'setUsername'
};

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_USERNAME:
      return { ...state, username: action.payload };
    default:
      throw new Error('Invalid action type: ' + action.type);
  }
}

//------------------------------------------------------------------------------
// The DuoAuthProvider to wrap those parts of the app that need authentication
//------------------------------------------------------------------------------

export function DuoAuthProvider({ duoEndpoint, redirectUri, checkInterval, children }) {
  const [state, dispatch] = useReducer(reducer, { username: undefined });
  duoEndpoint = duoEndpoint || DUO_ENDPOINT;

  function login(username, nopreauth) {
    const url = nopreauth ? duoEndpoint + '?nopreauth' : duoEndpoint;
    return apiRequest('POST', url, {
      username: username,
      redirect: redirectUri || null
    }).then((options) => {
      Duo.init(options);
      return true;
    });
  }

  function logout() {
    return apiRequest('DELETE', duoEndpoint).then(() => {
      dispatch({ type: actionTypes.SET_USERNAME, payload: null });
      return true;
    });
  }

  function check() {
    return apiRequest('GET', duoEndpoint).then((data) => {
      const username = data ? data.username : null;
      if (state.username !== username) {
        dispatch({ type: actionTypes.SET_USERNAME, payload: username });
      }
      return true;
    });
  }

  useEffect(() => {
    check();
  }, []);

  useInterval(check, typeof checkInterval === 'number' ? checkInterval : null);

  return React.createElement(
    DuoAuthContext.Provider,
    { value: { state, login, logout } },
    children
  );
}

export function DuoAuthLogin() {
  return React.createElement('div', {
    className: '__duo_login',
    id: 'duo_iframe'
  });
}

//------------------------------------------------------------------------------
// Internal helper functions
//------------------------------------------------------------------------------

/**
 * A generic API request.
 *
 * @param {string} method - the HTTP method
 * @param {string} url - the endpoint URL
 * @param {string} data - the data to send in a post
 *
 * @returns The response data or null on error.
 */
function apiRequest(method, url, data) {
  const config = {
    method: method,
    url: url,
    responseType: 'json',
    withCredentials: true,
    headers: { Pragma: 'no-cache' },
    data: data
  };
  return axios(config)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      const msg = (err.response && err.response.data && err.response.data.message) || err.message;
      return Promise.reject(new Error(msg));
    });
}

/**
 * A react hook for an interval timer.
 * Copied from: https://github.com/donavon/use-interval
 *
 * @param {function} callback - the function to call at each interval
 * @param {number} delay - the delay in milliseconds or null to stop
 */
const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = (...args) => savedCallback.current(...args);

    if (delay !== null) {
      const id = setInterval(handler, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
