import * as types from '../constants/PermissionActionTypes';
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

export const PERMISSION_REQUEST = 'PERMISSION_REQUEST';
export const PERMISSION_SUCCESS = 'PERMISSION_SUCCESS';
export const PERMISSION_FAILURE = 'PERMISSION_FAILURE';

const permissionRequest = createAction(PERMISSION_REQUEST);
const permissionSuccess = createAction(PERMISSION_SUCCESS, data => data);
const permissionFailure = createAction(PERMISSION_FAILURE,
  (bsStyle, message) => ({bsStyle, message})
);

/**
 * @param {Number} itemsPerPage - How many rows will fill in table.
 * @param {Number} startIndex - The index/id of the first row in table.
 */
export const fetchTableData = (itemsPerPage, startIndex) => {
  return (dispatch) => {
    dispatch(permissionRequest());
    var opts = {
      method: 'get',
      headers: {
        'Content-type': 'application/json'
      },
      mode: "cors"
    };

    var url = `/api/permission?itemsPerPage=${itemsPerPage}`;
    if (typeof startIndex === 'undefined') {
      url += `&startIndex=1`;
    } else {
      url += `&startIndex=${startIndex}`;
    }

    return fetch(url, opts)
      .then(response => {
        return response.json();
      }).then(json => {
        dispatch(permissionSuccess(json.data));
      }).catch(error => {
        console.log("fetch error:", error);
        dispatch(permissionFailure('danger', error.message));
      });
  }
}

export const PERMISSION_CHANGED_REQUEST  = 'PERMISSION_CHANGED_REQUEST';
export const PERMISSION_CHANGED_SUCCESS  = 'PERMISSION_CHANGED_SUCCESS';
export const PERMISSION_CHANGED_FAILURE  = 'PERMISSION_CHANGED_FAILURE';

const permissionChangedRequest = createAction(PERMISSION_CHANGED_REQUEST, (rowIdx, cols) => ({ rowIdx, cols }));
const permissionChangedSuccess = createAction(PERMISSION_CHANGED_SUCCESS, data => data);
const permissionChangedFailure = createAction(PERMISSION_CHANGED_FAILURE);

export const changePermission = (rowIdx, colIdx) => {
  return (dispatch, getState) => {
    const {
      permission: {
        tableData: { items }
      }
    } = getState();
    let row = items[rowIdx];
    let cols = row.cols.map((col, idx) => {
      if (idx === colIdx) {
        col.value = !col.value;
      }
      return col;
    })
    dispatch(permissionChangedRequest(rowIdx, cols));
    //return fetch(url, opts)
  }
}

export const PERMISSION_DELETE_REQUEST  = 'PERMISSION_DELETE_REQUEST';
export const PERMISSION_DELETE_SUCCESS  = 'PERMISSION_DELETE_SUCCESS';
export const PERMISSION_DELETE_FAILURE  = 'PERMISSION_DELETE_FAILURE';

const deletePermissionRequest = createAction(PERMISSION_DELETE_REQUEST);
const deletePermissionSuccess = createAction(PERMISSION_DELETE_SUCCESS, data => data);
const deletePermissionFailure = createAction(PERMISSION_DELETE_FAILURE,
  (bsStyle, message) => ({bsStyle, message})
);

export const deleteTableData = () => {
  return (dispatch, getState) => {
    dispatch(deletePermissionRequest());
    const { permission: { selectedRows } } = getState();

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
    // /api/permission/100,102,103
    var url = `/api/permission/${dataIdsStr}`;
    return fetch(url, opts)
      .then( checkStatus )
      .then( parseJSON )
      .then( json => dispatch(deletePermissionSuccess(json.data)) )
      .catch( error => dispatch(deletePermissionFailure('danger', error.message)) );
  }
}

export function changeSelectedRows(rowId, checked) {
  return (dispatch, getState) => {
    const { permission: { selectedRows } } = getState();

    if (selectedRows[rowId]) {
      delete selectedRows[rowId];
    } else {
      selectedRows[rowId] = true;
    }

    dispatch({
      type: types.CHANGE_SELECTED_ROWS,
      selectedRows
    })
  }
}

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
      if (state.permission.tableData.items.length !== 0) {
        rowData = state.permission.tableData.items[0];
      } else {
        // fake data
        rowData = {};
        rowData.cols = [
          { type: 'text', label: 'col1', value: '' },
          { type: 'text', label: 'col2', value: '' }
        ];
      }
      dispatch({
        type: types.PERMISSION_EDIT_DIALOG_SHOW,
        openDialog: true,
        formData: rowData.cols
      })
    } else {
      dispatch({
        type: types.PERMISSION_EDIT_DIALOG_HIDE,
        openDialog: true,
        formData: rowData.cols
      })
    }

  };
}

export function hideEditDialog() {
  return (dispatch, getState) => {
    dispatch({
      type: types.PERMISSION_EDIT_DIALOG_HIDE,
      openDialog: false,
      formData: []
    })
  };
}

export function updateEditFormFieldValue(label, value) {
  return (dispatch, getState) => {
    const { permission: { editFormData } } = getState();
    const id = _.findIndex(editFormData, field => field.label === label);
    if (id === -1) {
      console.log('Not found this field:', label, ', in editFormData:', editFormData);
      return false;
    }
    // TODO(chenyangf@yonyou.com): Dont touch state when value not changed.
    dispatch({
      type: types.UPDATE_EDIT_FORM_FIELD_VALUE,
      id,
      payload: value
    });
  };
};

export function initEditFormData(editFormData) {
  return dispatch => {
    dispatch({
      type: types.INIT_EDIT_FORM_DATA,
      editFormData
    });
  };
};

export function submitEditForm() {
  return (dispatch, getState) => {
    dispatch({
      type: types.SUBMIT_EDIT_FORM
    });
    const processResult = result => {
      result.error ?
        dispatch({
          type: types.SUBMIT_EDIT_FORM_FAIL,
          bsStyle: 'danger',
          message: result.error.message
        })
      :
        dispatch({
          type: types.SUBMIT_EDIT_FORM_SUCCESS,
          bsStyle: 'success',
          message: '提交成功'
        })
    };
    const { permission: { editFormData } } = getState();
    const idField = editFormData.find(field => field.label === 'id');
    const options = {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editFormData)
    };
    return fetch(`/api/permission/${idField.value}`, options)
      .then(checkStatus)
      .then(parseJSON)
      .then(processResult)
      .catch(error => {
        dispatch({
          type: types.SUBMIT_EDIT_FORM_FAIL,
          bsStyle: 'danger',
          message: error.message
        });
        throw error;
      });
  };
};

// create dialog

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
      if (state.permission.tableData.items.length !== 0) {
        rowData = state.permission.tableData.items[0];
      } else {
        // fake data
        rowData = {};
        rowData.cols = [
          { type: 'text', label: 'col1', value: '' },
          { type: 'text', label: 'col2', value: '' }
        ];
      }
      dispatch({
        type: types.PERMISSION_CREATE_DIALOG_SHOW,
        openDialog: true,
        formData: rowData.cols
      })
    } else {
      dispatch({
        type: types.PERMISSION_CREATE_DIALOG_SHOW,
        openDialog: true,
        formData: rowData.cols
      })
    }

  };
}

export function hideCreateDialog() {
  return (dispatch, getState) => {
    dispatch({
      type: types.PERMISSION_CREATE_DIALOG_HIDE,
      openDialog: false,
      formData: []
    })
  };
}

export function submitCreateForm() {
  return (dispatch, getState) => {
    dispatch({
      type: types.SUBMIT_CREATE_FORM
    });
    const processResult = result => {
      result.error ?
        dispatch({
          type: types.SUBMIT_CREATE_FORM_FAIL,
          bsStyle: 'danger',
          message: result.error.message
        })
      :
        dispatch({
          type: types.SUBMIT_CREATE_FORM_SUCCESS,
          bsStyle: 'success',
          message: '提交成功'
        })
    };
    const { permission: { createFormData } } = getState();
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(createFormData)
    };
    return fetch(`/api/permission`, options)
      .then(checkStatus)
      .then(parseJSON)
      .then(processResult)
      .catch(error => {
        dispatch({
          type: types.SUBMIT_CREATE_FORM_FAIL,
          bsStyle: 'danger',
          message: error.message
        });
        throw error;
      });
  };
};

export function initCreateFormData(formData) {
  return dispatch => {
    dispatch({
      type: types.INIT_CREATE_FORM_DATA,
      formData
    });
  };
};

export function updateCreateFormFieldValue(label, value) {
  return (dispatch, getState) => {
    const { permission: { createFormData } } = getState();
    const id = _.findIndex(createFormData, field => field.label === label);
    if (id === -1) {
      console.log('Not found this field:', label, ', in createFormData:', createFormData);
      return false;
    }
    // TODO(chenyangf@yonyou.com): Dont touch state when value not changed.
    dispatch({
      type: types.UPDATE_CREATE_FORM_FIELD_VALUE,
      id,
      payload: value
    });
  };
};

export function showAdminAlert() {
  return dispatch => {
    dispatch({
      type: types.PERMISSION_ADMIN_ALERT_SHOW
    });
  };
};

export function hideAdminAlert() {
  return dispatch => {
    dispatch({
      type: types.PERMISSION_ADMIN_ALERT_HIDE
    });
  };
};
