import fetch from 'isomorphic-fetch';
import _ from 'lodash';

import * as types from '../constants/ActionTypes';

// help functions
import * as utils from './utils';

// 后端接口URL，比如: LOCAL_EXPRESS_SERVER = '127.0.0.1:3009'
import * as URL from '../constants/URLs';

/**
 * Fetch API credentials 选项
 * - false 不往Fetch API中添加credentials选项
 * - same-origin 在请求中添加Cookie
 */
const FETCH_CREDENTIALS_OPTION = 'same-origin';

/** 配置Fetch API的credentials参数 */
function appendCredentials(opts) {
  if (FETCH_CREDENTIALS_OPTION) {
    opts.credentials = FETCH_CREDENTIALS_OPTION;
  }
  return opts;
}


/**
 * 获取表格体数据(table body)，以及表格字段数据(table head)。
 */

// 开始获取表格列模型
function requestTableColumnsModel() {
  return {
    type: types.LOAD_TABLECOLUMNS
  };
}

// 获取表格列模型成功
function receiveTableColumnsModelSuccess(json, fields) {
  return {
    type: types.LOAD_TABLECOLUMNS_SUCCESS,
    data: {
      fields
    }
  };
}

// 获取表格列模型失败
// message: 错误信息
// details: 比如HTTP response body，或者其他为了踢皮球而写的比较啰嗦的文字
function receiveTableColumnsModelFail(message, details) {
  return {
    type: types.LOAD_TABLECOLUMNS_FAIL,
    message,
    details
  };
}

// 开始获取表格体数据
function requestTableData() {
  return {
    type: types.LOAD_TABLEDATA
  };
}

// 成功获取到表格体数据
function receiveTableBodyDataSuccess(json, itemsPerPage) {
  return {
    type: types.LOAD_TABLEDATA_SUCCESS,
    data: {
      items: json.data,
      totalCount: json.totalnum,
      totalPage: Math.ceil(json.totalnum / itemsPerPage)
    }
  };
}

/**
 * 获取表格体数据失败
 * @param {String} message 错误信息
 */
function receiveTableBodyDataFail(message) {
  return {
    type: types.LOAD_TABLEDATA_FAIL,
    message
  };
}

function deleteTableDataSuccess(json) {
  return {
    type: types.DELETE_TABLEDATA_SUCCESS,
    data: json.data
  };
}

function deleteTableDataFail(message) {
  return {
    type: types.DELETE_TABLEDATA_FAIL,
    message
  };
}

function enableTableDataSuccess(json) {
  return {
    type: types.ENABLE_TABLEDATA_SUCCESS,
    data: json.data
  };
}

function enableTableDataFail(message) {
  return {
    type: types.ENABLE_TABLEDATA_FAIL,
    message
  };
}

// 开始获取表格体数据
function updateTableDataRequest() {
  return {
    type: types.TABLEDATA_UPDATE_REQUEST
  };
}

// rowIdx是可选参数，只有当修改表格数据的时候才会传这个参数
function updateTableDataSuccess(json, rowIdx) {
  // 后端返回的response总包含了修改之后的值，填写到表格中
  // 隐藏editDialog和createDialog
  // 显示adminAlert呈现“保存成功”
  return {
    type: types.TABLEDATA_UPDATE_SUCCESS,
    data: {
      rowIdx,
      rowData: json.data // json.data中保存了后端返回的改行修改后的新数据
    }
  };
}

function updateTableDataFailure(message) {
  return {
    type: types.TABLEDATA_UPDATE_FAILURE,
    message
  };
}

/**
 * 跳转到页
 */
export function gotoPage(startIndex, nextPage) {
  return (dispatch) => {
    dispatch({
      type: types.GOTO_PAGE,
      startIndex,
      nextPage
    });
  };
}

// 这个接口只获取表格体的数据
export function fetchTableBodyData(baseDocId, itemsPerPage, startIndex, nextPage, conditions) {
  return (dispatch) => {
    dispatch(requestTableData());
    let opts = {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      mode: 'cors',
      body: JSON.stringify({
        begin: startIndex,
        groupnum: itemsPerPage,
        conditions
      })
    };
    appendCredentials(opts);

    // let url = URL.getQueryURL(baseDocId);
    return fetch('http://127.0.0.1:3008/api/table/body', opts)
      .then((response) => {
        // TODO: HTTP状态检查，需要独立成helper function
        if (response.status >= 200 && response.status < 300) {
          return response;
        }
        let error = new Error(response.statusText);
        error.response = response;
        response.text().then((text) => {
          dispatch(receiveTableBodyDataFail('后端返回的HTTP status code不是200', text));
        });
        throw error;
      })
      .then(utils.parseJSON)
      .then((json) => {
        if (json.success === true) {
          // 进行业务层的数据校验
          const [isValid, validationMessage] = utils.validation.tableColumnsModelData(json);
          if (isValid) {
            dispatch(receiveTableBodyDataSuccess(json, itemsPerPage));
          } else {
            dispatch(receiveTableBodyDataFail(
              `虽然后端返回的success是true，而且客户端也获得到了JSON数据，
              但是数据校验方法提示说：“${validationMessage}”`,
              JSON.stringify(json.data, null, '  ')
            ));
          }
        } else {
          dispatch(receiveTableBodyDataFail('获取表格数据失败，后端返回的success是false',
            json.message));
        }
      }).catch((err) => {
        console.log('fetch table body error:', err);
      });
  };
}

/**
 * 复合操作：获取表格数据并将页码设定为下一页
 */
export function fetchTableBodyDataAndGotoPage(baseDocId, itemsPerPage, startIndex, nextPage, conditions) {
  return dispatch => dispatch(fetchTableBodyData(baseDocId, itemsPerPage, startIndex, null, conditions))
      .then(() => dispatch(gotoPage(startIndex, nextPage)));
}

/**
 * 获取表格的列模型
 */
export function fetchTableColumnsModel(baseDocId) {
  return (dispatch) => {
    dispatch(requestTableColumnsModel());

    let opts = {
      method: 'post',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      mode: 'cors',
      body: `doctype=${baseDocId}`
    };
    appendCredentials(opts);

    let url = 'http://127.0.0.1:3008/api/table/head';
    return fetch(url, opts)
      .then((response) => {
        // TODO: HTTP状态检查，需要独立成helper function
        if (response.status >= 200 && response.status < 300) {
          return response;
        }
        let error = new Error(response.statusText);
        error.response = response;
        response.text().then((text) => {
          dispatch(receiveTableColumnsModelFail('后端返回的HTTP status code不是200', text));
        });
        throw error;
      })
      .then(response => response.json())
      .then((json) => {
        if (json.success === true) {
          // 进行业务层的数据校验
          const [isValid, validationMessage] = utils.validation.tableColumnsModelData(json);
          if (isValid) {
            // 1. 删除不用的字段，按理说应该后端从response中删除掉的
            // 2. 修复后端json中的错别字，暂时在前端写死
            // 3. 后端数据类型使用int，前端使用string，暂时在前端写死
            // 4. 有些字段是必填项，暂时在前端写死
            // 5. 有些字段需要隐藏，暂时在前端写死
            // 6. 有些字段的类型错误，暂时在前端写死新类型
            // 7. 参照字段，后端传来的是refinfocode，但是前端Refer组件使用的是refCode
            // 8. 添加参照的配置
            // 9. 枚举的存储结构和前端不一致，需要转化一下
            // 10. 在字段上设置长度校验
            let fields = json.data
              /*  1 */ .filter(utils.shouldNotRemoveFields.bind(this, baseDocId))
              /*  2 */ .map(utils.fixFieldTypo)
              /*  3 */ .map(utils.convertDataType)
              /*  4 */ .map(utils.setRequiredFields.bind(this, baseDocId))
              /*  5 */ .map(utils.setHiddenFields)
              /*  6 */ .map(utils.fixDataTypes.bind(this, baseDocId))
              /*  7 */ .map(utils.fixReferKey)
              /*  8 */ .map(utils.setReferFields.bind(this, URL.ReferDataURL, URL.ReferUserDataURL))
              /*  9 */ .map(utils.fixEnumData)
              /* 10 */ .map(utils.setLengthValidation);
              /* 11 */
            dispatch(receiveTableColumnsModelSuccess(json, fields));
          } else {
            dispatch(receiveTableColumnsModelFail(
              `虽然后端返回的success是true，而且客户端也获得到了JSON数据，
              但是数据校验方法提示说：“${validationMessage}”`,
              JSON.stringify(json.data, null, '  ')
            ));
          }
        } else {
          dispatch(receiveTableColumnsModelFail(
            '后端返回的success不是true', JSON.stringify(json, null, '  '))
          );
        }
      })
      .catch((err) => {
        console.log('fetch table columns error:', err);
      });
  };
}

/**
 * 删除表格中的一行数据
 * @param {String} baseDocId 基础档案类型名称
 * @param {String} rowIdx 删除哪一行
 * @param {Object} rowData 被删除的行的数据对象
 */
export function deleteTableData(baseDocId, rowIdx, rowData) {
  return (dispatch) => {
    let opts = {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      mode: 'cors',
      body: JSON.stringify(rowData)
    };
    appendCredentials(opts);

    let url = URL.getDeleteURL(baseDocId);
    return fetch(url, opts)
      .then(response => response.json()).then((json) => {
        if (json.success === true) {
          dispatch(deleteTableDataSuccess(json));
        } else {
          dispatch(deleteTableDataFail(json.message));
        }
      }).catch((err) => {
        alert('删除时候出现错误');
        console.log('删除时候出现错误：', err);
      });
  };
}

/**
 * 启用 / 停用
 */
export function enableTableData(baseDocId, rowObj) {
  return (dispatch) => {
    let turnEnable = false;
    if (!rowObj.enable) {
      turnEnable = true;
    }
    const opts = {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      mode: 'cors',
      body: JSON.stringify({
        ...rowObj,
        enable: turnEnable
      })
    };
    appendCredentials(opts);

    const url = URL.getEnableURL(baseDocId);
    return fetch(url, opts)
      .then(response => response.json())
      .then((json) => {
        if (json.success === true) {
          dispatch(enableTableDataSuccess(json));
        } else {
          dispatch(enableTableDataFail(json.message));
        }
      })
      .catch(err => console.log('操作出现错误：', err));
  };
}

/**
 * 创建和修改表格数据都会调用到这里
 * rowIdx是可选参数，只有当修改表格数据（也就是点击表格每行最右侧的编辑按钮）
 * 的时候才会传这个参数
 * @param {String} baseDocId 基础档案类型名称，比如dept
 * @param {Array} fields 字段定义
 * @param {Object} formData 表单提交的数据
 * @param {Number} rowIndex 只有是修改了某一个行，才会传数字，否则传null
 */
export function saveTableData(baseDocId, fields, formData, rowIdx) {
  return (dispatch) => {
    let requestBodyObj = { ...formData };
    dispatch(updateTableDataRequest());

    // 注意：处理是有顺序的，不要乱调整
    // 1. 存储在formData中的参照是对象，往后端传的时候需要取出refer.selected[0].id传给后端。
    requestBodyObj = processRefer(requestBodyObj, fields);
    // 2. 删除key:value中，当value为undefined/null
    requestBodyObj = utils.removeEmpty(requestBodyObj);

    /**
     * 将formData中参照存储的复杂类型（包含id,code,name）转换成单值类型
     * ```json
     * {
     *   bumen: {
     *     id: '02EDD0F9-F384-43BF-9398-5E5781DAC5D0',
     *     code: '0502',
     *     name: '二车间'
     *   }
     * }
     * ```
     * 转换成
     * ```json
     * {
     *   bumen: '02EDD0F9-F384-43BF-9398-5E5781DAC5D0'
     * }
     * ```
     */
    function processRefer(obj, fields) {
      const newObj = { ...obj };
      fields.forEach((field) => {
        if (field.type === 'ref') {
          let fieldId = field.id;
          let fieldObj = obj[fieldId];
          // 用户是否选择过参照
          if (fieldObj && fieldObj.id) {
            newObj[fieldId] = fieldObj.id;
          } else {
            newObj[fieldId] = null;
          }
        }
      });
      return newObj;
    }

    function checkHTTPStatus(response) {
      // TODO: HTTP状态检查，需要独立成helper function
      if (response.status >= 200 && response.status < 300) {
        return response;
      }
      let error = new Error(response.statusText);
      error.response = response;
      response.text().then((text) => {
        dispatch(updateTableDataFailure(text));
      });
      throw error;
    }

    function processJSONResult(json) {
      if (json.success === true) {
        dispatch(updateTableDataSuccess(json, rowIdx));
      } else {
        dispatch(updateTableDataFailure(json.message));
      }
    }

    let opts = {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      mode: 'cors',
      body: JSON.stringify(requestBodyObj)
    };
    appendCredentials(opts);

    let url = URL.getSaveURL(baseDocId);
    return fetch(url, opts)
      .then(checkHTTPStatus)
      .then(utils.parseJSON)
      .then(processJSONResult)
      .catch((err) => {
        console.log('保存基础档案时候出现错误：', err);
      });
  };
}

/**
 * 复合操作：创建/保存并刷新表格
 */
export function saveTableDataAndFetchTableBodyData(baseDocId, fields, formData,
  rowIdx = null) {
  return (dispatch, getState) => {
    const { arch } = getState();
    return dispatch(saveTableData(baseDocId, fields, formData, rowIdx))
      .then(() => dispatch(fetchTableBodyData(baseDocId,
        arch.itemsPerPage, arch.startIndex, null, arch.conditions)));
  };
}

/**
 * 复合操作：创建/保存并刷新表格
 */
export function deleteTableDataAndFetchTableBodyData(baseDocId, rowIdx, rowData) {
  return (dispatch, getState) => {
    const { arch } = getState();
    return dispatch(deleteTableData(baseDocId, rowIdx, rowData))
      .then(() => dispatch(fetchTableBodyData(baseDocId,
        arch.itemsPerPage, arch.startIndex, null, arch.conditions)));
  };
}

/**
 * 复合操作：启用/停用并刷新表格
 */
export function enableTableDataAndFetchTableBodyData(baseDocId, rowObj) {
  return (dispatch, getState) => {
    const { arch } = getState();
    return dispatch(enableTableData(baseDocId, rowObj))
      .then(() => {
        setTimeout(() => {
          dispatch(handleMessage());
        }, 3000);
        return dispatch(fetchTableBodyData(baseDocId, arch.itemsPerPage,
          arch.startIndex, null, arch.conditions));
      });
  };
}

/**
 * @param {Object} [rowData] -  Table row data, e.g.
 * {
 *   id: '123',
 *   name: '456',
 *   mobileNumber: '1112223333'
 * }
 * When "CreateForm" call this, rowData will not pass, so we will try to get
 * table column(form field) information from table rows.
 *
 * rowIdx表示当前打开的编辑框对应是表格中的哪一行，第一行的rowIdx=0
 */
export function showEditDialog(rowIdx, rowData) {
  return (dispatch) => {
    dispatch({
      type: types.SHOW_EDIT_DIALOG,
      openDialog: true,
      formData: rowData,
      rowIdx
    });
  };
}

export function closeEditDialog() {
  return (dispatch) => {
    dispatch({
      type: types.EDIT_DIALOG_CLOSE,
      openDialog: false,
      formData: {},
      rowIdx: null
    });
  };
}

export function updateEditFormFieldValue(index, fieldModel, value) {
  return (dispatch) => {
    // TODO(chenyangf@yonyou.com): Dont touch state when value not changed.
    dispatch({
      type: types.UPDATE_EDIT_FORM_FIELD_VALUE,
      id: fieldModel.id,
      payload: value
    });
  };
}

export function initEditFormData(editFormData) {
  return (dispatch) => {
    dispatch({
      type: types.ARCH_INIT_EDIT_FORM_DATA,
      editFormData
    });
  };
}

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
export function showCreateDialog(rowData) {
  return (dispatch, getState) => {
    dispatch({
      type: types.SHOW_CREATE_DIALOG,
      openDialog: true,
      formData: rowData
    });
  };
}

export function hideCreateDialog() {
  return (dispatch, getState) => {
    dispatch({
      type: types.HIDE_CREATE_DIALOG,
      openDialog: false,
      formData: {}
    });
  };
}

export function submitCreateForm() {
  return (dispatch, getState) => {
    dispatch({
      type: types.SUBMIT_CREATE_FORM
    });
    const processResult = (result) => {
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
        });
    };
    const { arch: { createFormData } } = getState();
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(createFormData)
    };
    appendCredentials(options);
    return fetch('/api/arch', options)
      .then(utils.checkStatus)
      .then(utils.parseJSON)
      .then(processResult)
      .catch((error) => {
        dispatch({
          type: types.SUBMIT_CREATE_FORM_FAIL,
          bsStyle: 'danger',
          message: error.message
        });
        throw error;
      });
  };
}

export function initCreateFormData(formData) {
  return (dispatch) => {
    dispatch({
      type: types.INIT_CREATE_FORM_DATA,
      formData
    });
  };
}

export function updateCreateFormFieldValue(label, value) {
  return (dispatch, getState) => {
    const { arch: { fields } } = getState();
    const id = _.findIndex(fields, field => field.label === label);
    if (id === -1) {
      console.log('Not found this field:', label, ', in fields:', fields);
      return false;
    }
    // TODO(chenyangf@yonyou.com): Dont touch state when value not changed.
    dispatch({
      type: types.UPDATE_CREATE_FORM_FIELD_VALUE,
      id,
      payload: value
    });
  };
}

// 页面上的消息框

function updateErrorMessages(message) {
  return {
    type: types.ERROR_MESSAGES_UPDATE,
    message
  };
}

export function showAdminAlert() {
  return (dispatch) => {
    dispatch({
      type: types.SHOW_ADMIN_ALERT
    });
  };
}

export function hideAdminAlert() {
  return (dispatch) => {
    dispatch({
      type: types.HIDE_ADMIN_ALERT
    });
  };
}

export function handleMessage() {
  return (dispatch) => {
    dispatch({
      type: types.HIDE_MESSAGE_TIPS
    });
  };
}

// 对话框中的消息框

export function showFormAlert() {
  return (dispatch) => {
    dispatch({
      type: types.FORM_ALERT_OPEN
    });
  };
}

export function hideFormAlert() {
  return (dispatch) => {
    dispatch({
      type: types.FORM_ALERT_CLOSE
    });
  };
}

export function updateReferFields(code, fieldIndex) {
  return (dispatch) => {
    dispatch({
      type: types.REFER_FIELDS_UPDATE,
      fieldIndex,
      code
    });
  };
}

export const updateConditions = conditions => dispatch => (
  dispatch({
    type: types.CONDITIONS_UPDATE,
    conditions
  })
);
