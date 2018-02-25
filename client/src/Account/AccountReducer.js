import * as types from '../ActionTypes.js';

export default function account(state = {}, action) {
  switch (action.type) {
    /*case types.PERSIST:
      return Object.assign({}, state, {
        requestingPlaidToken: false,
        plaidAccessToken: action.payload.account.plaidAccessToken,
        plaidItemId: action.payload.account.plaidItemId
      }); */
    case types.REQUEST_PLAID_ACCESS_TOKEN:
      return Object.assign({}, state, {
        requestingPlaidToken: true
      });
    case types.REQUEST_PLAID_ACCESS_TOKEN_SUCCESS:
      return Object.assign({}, state, {
        requestingPlaidToken: false,
        plaidAccessToken: action.plaidAccessToken,
        plaidItemId: action.plaidItemId
      });
    case types.REQUEST_PLAID_ACCESS_TOKEN_FAILURE:
      return Object.assign({}, state, {
        requestingPlaidToken: false
      });
    default:
      return state;
  }
}
