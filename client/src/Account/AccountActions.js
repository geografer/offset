import * as types from '../ActionTypes.js';
import { push } from 'react-router-redux';
import { APIRequest } from '../helpers/requests.js';

export function requestPlaidAccessToken() {
  return {
    type: types.REQUEST_PLAID_ACCESS_TOKEN
  }
}

export function requestPlaidAccessTokenSuccess(token, item_id) {
  return {
    type: types.REQUEST_PLAID_ACCESS_TOKEN_SUCCESS,
    plaidAccessToken: token,
    plaidItemId: item_id
  }
}

export function requestPlaidAccessTokenFailure() {
  return {
    type: types.REQUEST_PLAID_ACCESS_TOKEN_FAILURE
  }
}

export function getPlaidToken(publicToken) {
  return function(dispatch) {
    dispatch(requestPlaidAccessToken());

    return APIRequest('/api/get_access_token', 'POST', {"public_token": publicToken}, (response) => {
      if (response.status === "success") {
        dispatch(requestPlaidAccessTokenSuccess(response.data.access_token, response.data.item_id));

        const delay = (ms) => new Promise(resolve =>
          setTimeout(resolve, ms)
        );
        delay(2000).then(() => { dispatch(push('/footprint')) });
      }
      else {
        dispatch(requestPlaidAccessTokenFailure());
      }
    }, (error) => {
      dispatch(requestPlaidAccessTokenFailure());
    });
  }
}
