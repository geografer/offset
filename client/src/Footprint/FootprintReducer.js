import * as types from '../ActionTypes.js';

export default function footprint(state = {}, action) {
  switch (action.type) {
    case types.LOAD_FOOTPRINT:
      return Object.assign({}, state, {
        loadingFootprint: true
      });

    case types.LOAD_FOOTPRINT_SUCCESS:
      return Object.assign({}, state, {
        loadingFootprint: false,
        footprintData: action.data
      });
      
    case types.LOAD_FOOTPRINT_FAILURE:
      return Object.assign({}, state, {
        loadingFootprint: false,
        footprintData: null
      });

    default:
      return state;
  }
}
