import update from 'react-addons-update';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

import * as ActionTypes from '../actions/externalDataModelling';

const initState = {
  loading: false,
  loaded: false,
  outerEntityTree: []
};

// Show case for redux-actions
export default handleActions({

  // Fetch nc sync data, fill in the table
  [ActionTypes.EXTERNAL_DATA_MODELLING_REQUEST]: (state, action) => ({...state,
    loading: true
  }),
  [ActionTypes.EXTERNAL_DATA_MODELLING_SUCCESS]: (state, action) => ({...state,
    loading: false,
    loaded: true,
    outerEntityTree: [...action.payload.data]
  }),
  [ActionTypes.EXTERNAL_DATA_MODELLING_FAILURE]: (state, action) => ({...state,
    loading: false,
    loaded: false,
    adminAlert: {...state.adminAlert,
      show: true,
      bsStyle: action.payload.bsStyle,
      message: action.payload.message
    }
  })

}, initState);
