import fetch from 'isomorphic-fetch';
import _ from 'lodash';
import { createAction } from 'redux-actions';

// Common helper -> utils.js/api.js
const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
};

const parseJSON = response => response.json();

// NC sync: fetch data

export const NC_SYNC_REQUEST = 'NC_SYNC_REQUEST';
export const NC_SYNC_SUCCESS = 'NC_SYNC_SUCCESS';
export const NC_SYNC_FAILURE = 'NC_SYNC_FAILURE';

export function fetchTableData(itemsPerPage, startIndex) {
  // use `callAPIMiddleware`
  return {
    types: [NC_SYNC_REQUEST, NC_SYNC_SUCCESS, NC_SYNC_FAILURE],
    // Check the cache (optional):
    //shouldCallAPI: (state) => !state.posts[userId],
    callAPI: () => {
      var opts = {
        method: 'get',
        headers: {
          'Content-type': 'application/json'
        },
        mode: "cors"
      };

      var url = `/api/ncsync?itemsPerPage=${itemsPerPage}`;
      if (typeof startIndex === 'undefined') {
        url += `&startIndex=1`;
      } else {
        url += `&startIndex=${startIndex}`;
      }

      return fetch(url, opts)
        .then(response => {
          return response.json();
        })
    }//,
    //payload: { itemsPerPage, startIndex }
  }
}

// NC sync: delete data

export const NC_SYNC_DELETE_REQUEST  = 'NC_SYNC_DELETE_REQUEST';
export const NC_SYNC_DELETE_SUCCESS  = 'NC_SYNC_DELETE_SUCCESS';
export const NC_SYNC_DELETE_FAILURE  = 'NC_SYNC_DELETE_FAILURE';

const deleteNCSyncRequest = createAction(NC_SYNC_DELETE_REQUEST);
const deleteNCSyncSuccess = createAction(NC_SYNC_DELETE_SUCCESS, data => data);
const deleteNCSyncFailure = createAction(NC_SYNC_DELETE_FAILURE,
  (bsStyle, message) => ({bsStyle, message})
);

export const deleteTableData = () => {
  return (dispatch, getState) => {
    dispatch(deleteNCSyncRequest());
    const { ncSync: { selectedRows } } = getState();

    const dataIds = [];
    Object.keys(selectedRows).map(function(value, index) {
      dataIds.push(index);
    });
    const dataIdsStr = dataIds.join(',');

    if (!dataIdsStr) {
      console.log('Not selected any row');
    }

    const opts = {
      method: 'delete',
    };
    // /api/ncsync/100,102,103
    var url = `/api/ncsync/${dataIdsStr}`;
    return fetch(url, opts)
      .then( checkStatus )
      .then( parseJSON )
      .then( json => dispatch(deleteNCSyncSuccess(json.data)) )
      .catch( error => dispatch(deleteNCSyncFailure('danger', error.message)) );
  }
}

// NC sync: update data

export const SUBMIT_EDIT_FORM = 'SUBMIT_EDIT_FORM';
export const SUBMIT_EDIT_FORM_SUCCESS = 'SUBMIT_EDIT_FORM_SUCCESS';
export const SUBMIT_EDIT_FORM_FAIL = 'SUBMIT_EDIT_FORM_FAIL';

export function submitEditForm() {
  return (dispatch, getState) => {
    dispatch({
      type: SUBMIT_EDIT_FORM
    });
    const processResult = result => {
      result.error ?
        dispatch({
          type: SUBMIT_EDIT_FORM_FAIL,
          bsStyle: 'danger',
          message: result.error.message
        })
      :
        dispatch({
          type: SUBMIT_EDIT_FORM_SUCCESS,
          bsStyle: 'success',
          message: '提交成功'
        })
    };
    const { ncSync: { editFormData } } = getState();
    const idField = editFormData.find(field => field.label === 'id');
    const options = {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editFormData)
    };
    return fetch(`/api/ncsync/${idField.value}`, options)
      .then(checkStatus)
      .then(parseJSON)
      .then(processResult)
      .catch(error => {
        dispatch({
          type: SUBMIT_EDIT_FORM_FAIL,
          bsStyle: 'danger',
          message: error.message
        });
        throw error;
      });
  };
};

// NC sync: create new data

export const SUBMIT_CREATE_FORM = 'SUBMIT_CREATE_FORM';
export const SUBMIT_CREATE_FORM_SUCCESS = 'SUBMIT_CREATE_FORM_SUCCESS';
export const SUBMIT_CREATE_FORM_FAIL = 'SUBMIT_CREATE_FORM_FAIL';

export function submitCreateForm() {
  return (dispatch, getState) => {
    dispatch({
      type: SUBMIT_CREATE_FORM
    });
    const processResult = result => {
      result.error ?
        dispatch({
          type: SUBMIT_CREATE_FORM_FAIL,
          bsStyle: 'danger',
          message: result.error.message
        })
      :
        dispatch({
          type: SUBMIT_CREATE_FORM_SUCCESS,
          bsStyle: 'success',
          message: '提交成功'
        })
    };
    const { ncSync: { createFormData } } = getState();
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(createFormData)
    };
    return fetch(`/api/ncsync`, options)
      .then(checkStatus)
      .then(parseJSON)
      .then(processResult)
      .catch(error => {
        dispatch({
          type: SUBMIT_CREATE_FORM_FAIL,
          bsStyle: 'danger',
          message: error.message
        });
        throw error;
      });
  };
};

// NC sync config: fetch data

export const NC_SYNC_CONFIG_REQUEST = 'NC_SYNC_CONFIG_REQUEST';
export const NC_SYNC_CONFIG_SUCCESS = 'NC_SYNC_CONFIG_SUCCESS';
export const NC_SYNC_CONFIG_FAILURE = 'NC_SYNC_CONFIG_FAILURE';

const configRequest = createAction(NC_SYNC_CONFIG_REQUEST);
const configSuccess = createAction(NC_SYNC_CONFIG_SUCCESS, data => data);
const configFailure = createAction(NC_SYNC_CONFIG_FAILURE,
  (bsStyle, message) => ({bsStyle, message})
);

export const fetchConfigData = () => {
  return (dispatch) => {
    dispatch(configRequest());
    var opts = {
      method: 'get',
      headers: {
        'Content-type': 'application/json'
      },
      mode: "cors"
    };

    var url = `/api/ncsync/config`;

    return fetch(url, opts)
      .then(response => {
        return response.json();
      }).then(json => {
        dispatch(configSuccess(json));
      }).catch(error => {
        console.log("fetch error:", error);
        dispatch(configFailure('danger', error.message));
      });
  }
}

// Table view

export const CHANGE_SELECTED_ROWS = 'CHANGE_SELECTED_ROWS';

export function changeSelectedRows(rowId, checked) {
  return (dispatch, getState) => {
    const { ncSync: { selectedRows } } = getState();

    if (selectedRows[rowId]) {
      delete selectedRows[rowId];
    } else {
      selectedRows[rowId] = true;
    }

    dispatch({
      type: CHANGE_SELECTED_ROWS,
      selectedRows
    })
  }
}

// AdminEditDialog view

export const NC_SYNC_EDIT_DIALOG_SHOW = 'NC_SYNC_EDIT_DIALOG_SHOW';
export const NC_SYNC_EDIT_DIALOG_HIDE = 'NC_SYNC_EDIT_DIALOG_HIDE';

/**
 * @param {Object} [rowData] -  Table row data, e.g.
 * {
 *   "cols": [
 *     {},
 *     {}
 *   ]
 * }
 * When "CreateForm" call this, rowData will not pass, so we will try to get 
 * table column(form field) information from table rows.
 */
export function showEditDialog(rowId, rowData) {
  return (dispatch, getState) => {
    if (!rowData) {
      let rowData;
      const state = getState();
      if (state.ncSync.tableData.items.length !== 0) {
        rowData = state.ncSync.tableData.items[0];
      } else {
        // fake data
        rowData = {};
        rowData.cols = [
          { type: 'text', label: 'col1', value: '' },
          { type: 'text', label: 'col2', value: '' }
        ];
      }
      dispatch({
        type: NC_SYNC_EDIT_DIALOG_SHOW,
        openDialog: true,
        formData: rowData.cols
      })
    } else {
      dispatch({
        type: NC_SYNC_EDIT_DIALOG_HIDE,
        openDialog: true,
        formData: rowData.cols
      })
    }

  };
}

export function hideEditDialog() {
  return (dispatch, getState) => {
    dispatch({
      type: NC_SYNC_EDIT_DIALOG_HIDE,
      openDialog: false,
      formData: []
    })
  };
}

// Edit form view

export function updateEditFormFieldValue(label, value) {
  return (dispatch, getState) => {
    const { ncSync: { editFormData } } = getState();
    const id = _.findIndex(editFormData, field => field.label === label);
    if (id === -1) {
      console.log('Not found this field:', label, ', in editFormData:', editFormData);
      return false;
    }
    // TODO(chenyangf@yonyou.com): Dont touch state when value not changed.
    dispatch({
      type: UPDATE_EDIT_FORM_FIELD_VALUE,
      id,
      payload: value
    });
  };
};

export const INIT_EDIT_FORM_DATA = 'INIT_EDIT_FORM_DATA';
export const UPDATE_EDIT_FORM_FIELD_VALUE = 'UPDATE_EDIT_FORM_FIELD_VALUE';

export function initEditFormData(editFormData) {
  return dispatch => {
    dispatch({
      type: INIT_EDIT_FORM_DATA,
      editFormData
    });
  };
};

// dialog view

export const NC_SYNC_CREATE_DIALOG_SHOW = 'NC_SYNC_CREATE_DIALOG_SHOW';
export const NC_SYNC_CREATE_DIALOG_HIDE = 'NC_SYNC_CREATE_DIALOG_HIDE';

/**
 * @param {Object} [rowData] -  Table row data, e.g.
 * {
 *   "cols": [
 *     {},
 *     {}
 *   ]
 * }
 * When "CreateForm" call this, rowData will not pass, so we will try to get 
 * table column(form field) information from table rows.
 */
export function showCreateDialog(rowId, rowData) {
  return (dispatch, getState) => {
    if (!rowData) {
      let rowData;
      const state = getState();
      if (state.ncSync.tableData.items.length !== 0) {
        rowData = state.ncSync.tableData.items[0];
      } else {
        // fake data
        rowData = {};
        rowData.cols = [
          { type: 'text', label: 'col1', value: '' },
          { type: 'text', label: 'col2', value: '' }
        ];
      }
      dispatch({
        type: NC_SYNC_CREATE_DIALOG_SHOW,
        openDialog: true,
        formData: rowData.cols
      })
    } else {
      dispatch({
        type: NC_SYNC_CREATE_DIALOG_SHOW,
        openDialog: true,
        formData: rowData.cols
      })
    }

  };
}

export function hideCreateDialog() {
  return (dispatch, getState) => {
    dispatch({
      type: NC_SYNC_CREATE_DIALOG_HIDE,
      openDialog: false,
      formData: []
    })
  };
}

export const INIT_CREATE_FORM_DATA = 'INIT_CREATE_FORM_DATA';
export const UPDATE_CREATE_FORM_FIELD_VALUE = 'UPDATE_CREATE_FORM_FIELD_VALUE';

export function initCreateFormData(formData) {
  return dispatch => {
    dispatch({
      type: INIT_CREATE_FORM_DATA,
      formData
    });
  };
};

export function updateCreateFormFieldValue(label, value) {
  return (dispatch, getState) => {
    const { ncSync: { createFormData } } = getState();
    const id = _.findIndex(createFormData, field => field.label === label);
    if (id === -1) {
      console.log('Not found this field:', label, ', in createFormData:', createFormData);
      return false;
    }
    // TODO(chenyangf@yonyou.com): Dont touch state when value not changed.
    dispatch({
      type: UPDATE_CREATE_FORM_FIELD_VALUE,
      id,
      payload: value
    });
  };
};

// alert view

export const NC_SYNC_ADMIN_ALERT_SHOW = 'NC_SYNC_ADMIN_ALERT_SHOW';
export const NC_SYNC_ADMIN_ALERT_HIDE = 'NC_SYNC_ADMIN_ALERT_HIDE';

export function showAdminAlert() {
  return dispatch => {
    dispatch({
      type: NC_SYNC_ADMIN_ALERT_SHOW
    });
  };
};

export function hideAdminAlert() {
  return dispatch => {
    dispatch({
      type: NC_SYNC_ADMIN_ALERT_HIDE
    });
  };
};
