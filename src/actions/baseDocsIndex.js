import * as types from '../constants/ActionTypes';
import fetch from 'isomorphic-fetch';
import _ from 'lodash';

// Common helper -> utils.js/api.js
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function parseJSON(response) {
  return response.json();
}


function requestTableData() {
  return {
    type: types.LOAD_TABLEDATA
  }
}

function receiveTableData(json) {
  return {
    type: types.LOAD_TABLEDATA_SUCCESS,
    data: json.data
  }
}

function deleteTableDataSuccess(json) {
  return {
    type: types.DELETE_TABLEDATA_SUCCESS,
    data: json.data
  }
}

export function fetchTableData(itemsPerPage, startIndex) {
  return (dispatch) => {
    dispatch(requestTableData());
    var opts = {
      method: 'get',
      headers: {
        'Content-type': 'application/json'
      },
      mode: "cors"
    };

    var url = `/api/arch?itemsPerPage=${itemsPerPage}`;
    if (typeof startIndex === 'undefined') {
      url += `&startIndex=1`;
    } else {
      url += `&startIndex=${startIndex}`;
    }

    return fetch(url, opts)
      .then(response => {
        return response.json();
      }).then(json => {
        dispatch(receiveTableData(json));
      }).catch(function (err) {
        console.log("fetch error:", err);
      });
  }
}

export function deleteTableData() {
  return (dispatch, getState) => {
    const { arch: { selectedRows } } = getState();

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
    // /api/arch/100,102,103
    var url = `/api/arch/${dataIdsStr}`;
    return fetch(url, opts)
      .then(response => {
        return response.json();
      }).then(json => {
        dispatch(deleteTableDataSuccess(json));
        // TODO(chenyangf@yonyou.com): Should fetch new data
      }).catch(function (err) {
        console.log("delete error:", err);
      });
  }
}

export function changeSelectedRows(rowId, checked) {
  return (dispatch, getState) => {
    const { arch: { selectedRows } } = getState();

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
      if (state.arch.data.items.length !== 0) {
        rowData = state.arch.data.items[0];
      } else {
        // fake data
        rowData = {};
        rowData.cols = [
          { type: 'text', label: 'col1', value: '' },
          { type: 'text', label: 'col2', value: '' }
        ];
      }
      dispatch({
        type: types.SHOW_EDIT_DIALOG,
        openDialog: true,
        formData: rowData.cols
      })
    } else {
      dispatch({
        type: types.SHOW_EDIT_DIALOG,
        openDialog: true,
        formData: rowData.cols
      })
    }

  };
}

export function hideEditDialog() {
  return (dispatch, getState) => {
    dispatch({
      type: types.HIDE_EDIT_DIALOG,
      openDialog: false,
      formData: []
    })
  };
}

export function updateEditFormFieldValue(label, value) {
  return (dispatch, getState) => {
    const { arch: { editFormData } } = getState();
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
      if (state.arch.data.items.length !== 0) {
        rowData = state.arch.data.items[0];
      } else {
        // fake data
        rowData = {};
        rowData.cols = [
          { type: 'text', label: 'col1', value: '' },
          { type: 'text', label: 'col2', value: '' }
        ];
      }
      dispatch({
        type: types.SHOW_CREATE_DIALOG,
        openDialog: true,
        formData: rowData.cols
      })
    } else {
      dispatch({
        type: types.SHOW_CREATE_DIALOG,
        openDialog: true,
        formData: rowData.cols
      })
    }

  };
}

export function hideCreateDialog() {
  return (dispatch, getState) => {
    dispatch({
      type: types.HIDE_CREATE_DIALOG,
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
    const { arch: { createFormData } } = getState();
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(createFormData)
    };
    return fetch(`/api/arch`, options)
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
    const { arch: { createFormData } } = getState();
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
      type: types.SHOW_ADMIN_ALERT
    });
  };
};

export function hideAdminAlert() {
  return dispatch => {
    dispatch({
      type: types.HIDE_ADMIN_ALERT
    });
  };
};
