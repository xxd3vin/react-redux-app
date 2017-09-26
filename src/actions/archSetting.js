import * as types from '../constants/ArchSettingActionTypes';
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

const archSettingRequest = createAction(types.ARCH_SETTING_REQUEST);
const archSettingSuccess = createAction(types.ARCH_SETTING_SUCCESS, data => data);
const archSettingFailure = createAction(types.ARCH_SETTING_FAILURE,
  (bsStyle, message) => ({bsStyle, message})
);

/**
 * @param {Number} itemsPerPage - How many rows will fill in table.
 * @param {Number} startIndex - The index/id of the first row in table.
 */
export const fetchTableData = (itemsPerPage, startIndex) => {
  return (dispatch) => {
    dispatch(archSettingRequest());
    var opts = {
      method: 'get',
      headers: {
        'Content-type': 'application/json'
      },
      mode: "cors"
    };

    var url = `/api/archsetting?itemsPerPage=${itemsPerPage}`;
    if (typeof startIndex === 'undefined') {
      url += `&startIndex=1`;
    } else {
      url += `&startIndex=${startIndex}`;
    }

    return fetch(url, opts)
      .then(response => {
        return response.json();
      }).then(json => {
        dispatch(archSettingSuccess(json.data));
      }).catch(error => {
        console.log("fetch error:", error);
        dispatch(archSettingFailure('danger', error.message));
      });
  }
}

const configRequest = createAction(types.ARCH_SETTING_CONFIG_REQUEST);
const configSuccess = createAction(types.ARCH_SETTING_CONFIG_SUCCESS, data => data);
const configFailure = createAction(types.ARCH_SETTING_CONFIG_FAILURE,
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

    var url = `/api/archsetting/config`;

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

const deleteArchSettingRequest = createAction(types.ARCH_SETTING_DELETE_REQUEST);
const deleteArchSettingSuccess = createAction(types.ARCH_SETTING_DELETE_SUCCESS, data => data);
const deleteArchSettingFailure = createAction(types.ARCH_SETTING_DELETE_FAILURE,
  (bsStyle, message) => ({bsStyle, message})
);

export const deleteTableData = () => {
  return (dispatch, getState) => {
    dispatch(deleteArchSettingRequest());
    const { archSetting: { selectedRows } } = getState();

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
    // /api/archsetting/100,102,103
    var url = `/api/archsetting/${dataIdsStr}`;
    return fetch(url, opts)
      .then( checkStatus )
      .then( parseJSON )
      .then( json => dispatch(deleteArchSettingSuccess(json.data)) )
      .catch( error => dispatch(deleteArchSettingFailure('danger', error.message)) );
  }
}

export function changeSelectedRows(rowId, checked) {
  return (dispatch, getState) => {
    const { archSetting: { selectedRows } } = getState();

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
      if (state.archSetting.tableData.items.length !== 0) {
        rowData = state.archSetting.tableData.items[0];
      } else {
        // fake data
        rowData = {};
        rowData.cols = [
          { type: 'text', label: 'col1', value: '' },
          { type: 'text', label: 'col2', value: '' }
        ];
      }
      dispatch({
        type: types.ARCH_SETTING_EDIT_DIALOG_SHOW,
        openDialog: true,
        formData: rowData.cols
      })
    } else {
      dispatch({
        type: types.ARCH_SETTING_EDIT_DIALOG_HIDE,
        openDialog: true,
        formData: rowData.cols
      })
    }

  };
}

export function hideEditDialog() {
  return (dispatch, getState) => {
    dispatch({
      type: types.ARCH_SETTING_EDIT_DIALOG_HIDE,
      openDialog: false,
      formData: []
    })
  };
}

export function updateEditFormFieldValue(label, value) {
  return (dispatch, getState) => {
    const { archSetting: { editFormData } } = getState();
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
    const { archSetting: { editFormData } } = getState();
    const idField = editFormData.find(field => field.label === 'id');
    const options = {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editFormData)
    };
    return fetch(`/api/archsetting/${idField.value}`, options)
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
      if (state.archSetting.tableData.items.length !== 0) {
        rowData = state.archSetting.tableData.items[0];
      } else {
        // fake data
        rowData = {};
        rowData.cols = [
          { type: 'text', label: 'col1', value: '' },
          { type: 'text', label: 'col2', value: '' }
        ];
      }
      dispatch({
        type: types.ARCH_SETTING_CREATE_DIALOG_SHOW,
        openDialog: true,
        formData: rowData.cols
      })
    } else {
      dispatch({
        type: types.ARCH_SETTING_CREATE_DIALOG_SHOW,
        openDialog: true,
        formData: rowData.cols
      })
    }

  };
}

export function hideCreateDialog() {
  return (dispatch, getState) => {
    dispatch({
      type: types.ARCH_SETTING_CREATE_DIALOG_HIDE,
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
    const { archSetting: { createFormData } } = getState();
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(createFormData)
    };
    return fetch(`/api/archsetting`, options)
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
    const { archSetting: { createFormData } } = getState();
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
      type: types.ARCH_SETTING_ADMIN_ALERT_SHOW
    });
  };
};

export function hideAdminAlert() {
  return dispatch => {
    dispatch({
      type: types.ARCH_SETTING_ADMIN_ALERT_HIDE
    });
  };
};
