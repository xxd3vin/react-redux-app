import fetch from 'isomorphic-fetch';
import _ from 'lodash';
import { createAction } from 'redux-actions';

/**
 * 后端接口
 * 比如: LOCAL_EXPRESS_SERVER = '127.0.0.1:3009'
 */
import * as URL from '../constants/URLs';

/**
 * Fetch API credentials 选项
 * - false 不往Fetch API中添加credentials选项
 * - same-origin 在请求中添加Cookie
 */
const FETCH_CREDENTIALS_OPTION = 'same-origin';

/**
 * 是否启用后端的开发用服务器
 * - 0 使用本地的expressjs服务器伪造数据
 * - 1 使用后端提供的测试服务器
 */
const ENABLE_DEV_BACKEND = 0;

/**
 * 根据配置获取到基础档案的绝对路径
 * 比如：http://127.0.0.1:3009/dept/query
 */
function getBaseDocURL(path) {
  // 生产环境下直接使用生产服务器IP
  if (process.env.NODE_ENV === 'production') {
    return 'http://' + process.env.PROD_SERVER + path;
  }
  return (ENABLE_DEV_BACKEND
    ? `http://${URL.BASEDOC_DEV_SERVER}`
    : `http://${URL.LOCAL_EXPRESS_SERVER}`) + path;
}

/**
 * 根据配置获取到参照的绝对路径
 * 比如：http://127.0.0.1:3009/userCenter/queryUserAndDeptByDeptPk
 */
function getReferURL(path) {
  // 生产环境下直接使用生产服务器IP
  if (process.env.NODE_ENV === 'production') {
    return 'http://' + process.env.PROD_SERVER + path;
  }
  return (ENABLE_DEV_BACKEND
    ? `http://${URL.REFER_DEV_SERVER}`
    : `http://${URL.LOCAL_EXPRESS_SERVER}`) + path;
}

/**
 * 根据配置获取到外部数据建模的绝对路径
 * 比如：http://59.110.123.20/ficloud/outerentitytree/querytree
 */
function getExternalDataModellingURL(path) {
  // 生产环境下直接使用生产服务器IP
  if (process.env.NODE_ENV === 'production') {
    return 'http://' + process.env.PROD_SERVER + path;
  }
  return (ENABLE_DEV_BACKEND
    ? `http://${URL.EXTERNAL_DATA_MODELLING_DEV_SERVER}`
    : `http://${URL.LOCAL_EXPRESS_SERVER}`) + path;
}

/**
 * 基础档案 组装后端接口
 */
const OUTER_ENTITY_TREE_URL = getExternalDataModellingURL('/ficloud_web/outerentitytree/querytree');
const QUERY_DOCTYPE_URL = getBaseDocURL('/ficloud_pub/querydoctype');
const getSaveURL = type => getBaseDocURL(`/${type}/save`);
const getDeleteURL = type => getBaseDocURL(`/${type}/delete`);
const getQueryURL = type => getBaseDocURL(`/${type}/query`);
/**
 * 参照 组装后端接口
 */
const ReferDataURL = getReferURL('/refbase_ctr/queryRefJSON');
const ReferUserDataURL = getReferURL('/userCenter/queryUserAndDeptByDeptPk');

/** 配置Fetch API的credentials参数 */
function appendCredentials(opts) {
  if (FETCH_CREDENTIALS_OPTION) {
    opts.credentials = FETCH_CREDENTIALS_OPTION;
  }
  return opts;
}

/**
 * 常用的helper function
 * 可以扔到utils.js中
 */

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

export const EXTERNAL_DATA_MODELLING_REQUEST = 'EXTERNAL_DATA_MODELLING_REQUEST';
export const EXTERNAL_DATA_MODELLING_SUCCESS = 'EXTERNAL_DATA_MODELLING_SUCCESS';
export const EXTERNAL_DATA_MODELLING_FAILURE = 'EXTERNAL_DATA_MODELLING_FAILURE';

export function fetchOuterEntityTree(billTypeCode) {
  // use `callAPIMiddleware`
  return {
    types: [EXTERNAL_DATA_MODELLING_REQUEST, EXTERNAL_DATA_MODELLING_SUCCESS, EXTERNAL_DATA_MODELLING_FAILURE],
    // Check the cache (optional):
    //shouldCallAPI: (state) => !state.posts[userId],
    callAPI: () => {
      var opts = {
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        mode: "cors",
        body: JSON.stringify({
          billtypecode: billTypeCode // {"billtypecode": "2643"}
        })
      };
      appendCredentials(opts);

      var url = `${OUTER_ENTITY_TREE_URL}`;

      return fetch(url, opts)
        .then(response => {
          return response.json();
        })
        .then(resObj => {
          // 处理success: false
          return resObj;
        })
    }
  }
}

// NC sync: delete data

export const EXTERNAL_DATA_MODELLING_DELETE_REQUEST  = 'EXTERNAL_DATA_MODELLING_DELETE_REQUEST';
export const EXTERNAL_DATA_MODELLING_DELETE_SUCCESS  = 'EXTERNAL_DATA_MODELLING_DELETE_SUCCESS';
export const EXTERNAL_DATA_MODELLING_DELETE_FAILURE  = 'EXTERNAL_DATA_MODELLING_DELETE_FAILURE';

const deleteNCSyncRequest = createAction(EXTERNAL_DATA_MODELLING_DELETE_REQUEST);
const deleteNCSyncSuccess = createAction(EXTERNAL_DATA_MODELLING_DELETE_SUCCESS, data => data);
const deleteNCSyncFailure = createAction(EXTERNAL_DATA_MODELLING_DELETE_FAILURE,
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

export const EXTERNAL_DATA_MODELLING_CONFIG_REQUEST = 'EXTERNAL_DATA_MODELLING_CONFIG_REQUEST';
export const EXTERNAL_DATA_MODELLING_CONFIG_SUCCESS = 'EXTERNAL_DATA_MODELLING_CONFIG_SUCCESS';
export const EXTERNAL_DATA_MODELLING_CONFIG_FAILURE = 'EXTERNAL_DATA_MODELLING_CONFIG_FAILURE';

const configRequest = createAction(EXTERNAL_DATA_MODELLING_CONFIG_REQUEST);
const configSuccess = createAction(EXTERNAL_DATA_MODELLING_CONFIG_SUCCESS, data => data);
const configFailure = createAction(EXTERNAL_DATA_MODELLING_CONFIG_FAILURE,
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

export const EXTERNAL_DATA_MODELLING_EDIT_DIALOG_SHOW = 'EXTERNAL_DATA_MODELLING_EDIT_DIALOG_SHOW';
export const EXTERNAL_DATA_MODELLING_EDIT_DIALOG_HIDE = 'EXTERNAL_DATA_MODELLING_EDIT_DIALOG_HIDE';

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
        type: EXTERNAL_DATA_MODELLING_EDIT_DIALOG_SHOW,
        openDialog: true,
        formData: rowData.cols
      })
    } else {
      dispatch({
        type: EXTERNAL_DATA_MODELLING_EDIT_DIALOG_HIDE,
        openDialog: true,
        formData: rowData.cols
      })
    }

  };
}

export function hideEditDialog() {
  return (dispatch, getState) => {
    dispatch({
      type: EXTERNAL_DATA_MODELLING_EDIT_DIALOG_HIDE,
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

export const EXTERNAL_DATA_MODELLING_CREATE_DIALOG_SHOW = 'EXTERNAL_DATA_MODELLING_CREATE_DIALOG_SHOW';
export const EXTERNAL_DATA_MODELLING_CREATE_DIALOG_HIDE = 'EXTERNAL_DATA_MODELLING_CREATE_DIALOG_HIDE';

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
        type: EXTERNAL_DATA_MODELLING_CREATE_DIALOG_SHOW,
        openDialog: true,
        formData: rowData.cols
      })
    } else {
      dispatch({
        type: EXTERNAL_DATA_MODELLING_CREATE_DIALOG_SHOW,
        openDialog: true,
        formData: rowData.cols
      })
    }

  };
}

export function hideCreateDialog() {
  return (dispatch, getState) => {
    dispatch({
      type: EXTERNAL_DATA_MODELLING_CREATE_DIALOG_HIDE,
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

export const EXTERNAL_DATA_MODELLING_ADMIN_ALERT_SHOW = 'EXTERNAL_DATA_MODELLING_ADMIN_ALERT_SHOW';
export const EXTERNAL_DATA_MODELLING_ADMIN_ALERT_HIDE = 'EXTERNAL_DATA_MODELLING_ADMIN_ALERT_HIDE';

export function showAdminAlert() {
  return dispatch => {
    dispatch({
      type: EXTERNAL_DATA_MODELLING_ADMIN_ALERT_SHOW
    });
  };
};

export function hideAdminAlert() {
  return dispatch => {
    dispatch({
      type: EXTERNAL_DATA_MODELLING_ADMIN_ALERT_HIDE
    });
  };
};
