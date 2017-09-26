import update from 'react-addons-update';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

import * as ActionTypes from '../actions/ncSync';

const initState = {
  loaded: false,
  tableData: {
    "currentItemCount": 5,
    "itemsPerPage": 5,
    "startIndex": 1,
    "totalItems": 0,
    "items": []
  },
  config: {},
  selectedRows: {},
  editDialog: {
    show: false,
    formData: []
  },
  editFormData: [],
  createDialog: {
    show: false
  },
  createFormData: [],
  adminAlert: {
    show: false,
    error: {
      code: 0,
      bsStyle: 'danger',
      message: ''
    }
  }
};

// Show case for redux-actions
export default handleActions({

  // Fetch nc sync data, fill in the table
  [ActionTypes.NC_SYNC_REQUEST]: (state, action) => ({...state,
    loading: true
  }),
  [ActionTypes.NC_SYNC_SUCCESS]: (state, action) => ({...state,
    loading: false,
    loaded: true,
    tableData: {...action.payload}
  }),
  [ActionTypes.NC_SYNC_FAILURE]: (state, action) => ({...state,
    loading: false,
    loaded: false,
    adminAlert: {...state.adminAlert,
      show: true,
      bsStyle: action.payload.bsStyle,
      message: action.payload.message
    }
  }),

  // Fetch NC sync config data, fill in the tree view
  [ActionTypes.NC_SYNC_CONFIG_REQUEST]: (state, action) => ({...state,
    configLoading: true
  }),
  [ActionTypes.NC_SYNC_CONFIG_SUCCESS]: (state, action) => ({...state,
    configLoading: false,
    configLoaded: true,
    config: {...action.payload}
  }),
  [ActionTypes.NC_SYNC_CONFIG_FAILURE]: (state, action) => ({...state,
    configLoading: false,
    configLoaded: false,
    adminAlert: {...state.adminAlert,
      show: true,
      bsStyle: action.payload.bsStyle,
      message: action.payload.message
    }
  }),

  // Remove premission data
  [ActionTypes.NC_SYNC_DELETE_SUCCESS]: (state, action) => ({...state/*,
    tableData: {...action.payload}*/
  }),

  // edit dialog
  [ActionTypes.UPDATE_EDIT_FORM_FIELD_VALUE]: (state, action) => (
    // Update single value inside specific array item
    // http://stackoverflow.com/questions/35628774/how-to-update-single-value-inside-specific-array-item-in-redux
    update(state, { 
      editFormData: { 
        [action.id]: {
          value: {$set: action.payload}
        }
      }
    })
  ),
  [ActionTypes.INIT_EDIT_FORM_DATA]: (state, action) => ({...state,
    editFormData: action.editFormData
  }),
  [ActionTypes.SUBMIT_EDIT_FORM]: (state, action) => ({...state,
    submitting: true
  }),
  [ActionTypes.SUBMIT_EDIT_FORM_SUCCESS]: (state, action) => ({...state,
    submitting: false,
    submited: true,
    adminAlert: {...state.adminAlert,
      show: true,
      bsStyle: action.bsStyle,
      message: action.message
    }
  }),
  [ActionTypes.SUBMIT_EDIT_FORM_FAIL]: (state, action) => ({...state,
    submitting: false,
    submitted: false,
    adminAlert: {...state.adminAlert,
      show: true,
      bsStyle: action.bsStyle,
      message: action.message
    }
  }),

  // create form
  [ActionTypes.UPDATE_CREATE_FORM_FIELD_VALUE]: (state, action) => (
    // Update single value inside specific array item
    // http://stackoverflow.com/questions/35628774/how-to-update-single-value-inside-specific-array-item-in-redux
    update(state, { 
      createFormData: { 
        [action.id]: {
          value: {$set: action.payload}
        }
      }
    })
  ),
  [ActionTypes.INIT_CREATE_FORM_DATA]: (state, action) => ({...state,
    createFormData: action.formData
  }),
  [ActionTypes.SUBMIT_CREATE_FORM]: (state, action) => ({...state,
    submitting: true
  }),
  [ActionTypes.SUBMIT_CREATE_FORM_SUCCESS]: (state, action) => ({...state,
    submitting: false,
    submited: true,
    adminAlert: {...state.adminAlert,
      show: true,
      bsStyle: action.bsStyle,
      message: action.message
    }
  }),
  [ActionTypes.SUBMIT_CREATE_FORM_FAIL]: (state, action) => ({...state,
    submitting: false,
    submitted: false,
    adminAlert: {...state.adminAlert,
      show: true,
      bsStyle: action.bsStyle,
      message: action.message
    }
  }),

  // View state

  // admin alert
  [ActionTypes.NC_SYNC_ADMIN_ALERT_SHOW]: (state, action) => (
    update(state, {
      adminAlert: {
        show: {$set: true}
      }
    })
  ),
  [ActionTypes.NC_SYNC_ADMIN_ALERT_HIDE]: (state, action) => (
    update(state, {
      adminAlert: {
        show: {$set: false}
      }
    })
  ),

  // nc sync table
  [ActionTypes.CHANGE_SELECTED_ROWS]: (state, action) => ({...state,
    selectedRows: action.selectedRows
  }),

  // edit dialog
  // TODO(chenyangf@yonyou.com): Use combineActions to reduce code
  [ActionTypes.NC_SYNC_EDIT_DIALOG_SHOW]: (state, action) => ({...state,
    editDialog: {
      show: action.openDialog,
      formData: action.formData
    },
    editFormData: action.formData
  }),
  [ActionTypes.NC_SYNC_EDIT_DIALOG_HIDE]: (state, action) => ({...state,
    editDialog: {
      show: action.openDialog,
      formData: action.formData
    },
    editFormData: action.formData
  }),

  // create dialog
  // TODO(chenyangf@yonyou.com): Use combineActions to reduce code
  [ActionTypes.NC_SYNC_CREATE_DIALOG_SHOW]: (state, action) => ({...state,
    createDialog: {
      show: action.openDialog,
      formData: action.formData
    },
    createFormData: action.formData
  }),
  [ActionTypes.NC_SYNC_CREATE_DIALOG_HIDE]: (state, action) => ({...state,
    createDialog: {
      show: action.openDialog,
      formData: action.formData
    },
    createFormData: action.formData
  })

}, initState);
