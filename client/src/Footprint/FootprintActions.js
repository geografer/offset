import * as types from '../ActionTypes.js';
import { push } from 'react-router-redux';
import { APIRequest } from '../helpers/requests.js';

export function loadFootprint() {
  return {
    type: types.LOAD_FOOTPRINT
  }
}

export function loadFootprintSuccess(data) {
  return {
    type: types.LOAD_FOOTPRINT_SUCCESS,
    data: data
  }
}

export function loadFootprintFailure(transactions) {
  return {
    type: types.LOAD_FOOTPRINT_FAILURE
  }
}

export function getToken() {
  return function(dispatch) {

  }
}

export function getFootprint() {
  return function(dispatch, getState) {
    const state = getState();
    const access_token = state.account.plaidAccessToken;

    dispatch(loadFootprint());

    return APIRequest('/api/get_transactions?access_token='+access_token, 'GET', { "access_token": access_token }, (response) => {
      console.log(response);

      if (response.status === "success") {
        dispatch(loadFootprintSuccess(response.data));
      }
      else {
        dispatch(loadFootprintFailure());
      }
    }, (error) => {
      dispatch(loadFootprintFailure());
    });
  }
}
