/**
 * Created by Tiger on 17/3/23.
 */
import * as types from '../constants/ActionTypes';
import fetch from 'isomorphic-fetch';
import _ from 'lodash';

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
  }
}

// 获取表格列模型成功
function receiveTableColumnsModelSuccess(json, fields) {
  return {
    type: types.LOAD_TABLECOLUMNS_SUCCESS,
    data: {
      fields
    }
  }
}

// 获取表格列模型失败
// message: 错误信息
// details: 比如HTTP response body，或者其他为了踢皮球而写的比较啰嗦的文字
function receiveTableColumnsModelFail(message, details) {
  return {
    type: types.LOAD_TABLECOLUMNS_FAIL,
    message, details
  }
}

// 开始获取表格体数据
function requestTableData() {
  return {
    type: types.LOAD_TABLEDATA
  }
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
 * @param {String} resBody 比如，可以是HTTP response body，也可以是其他说明信息
 *                         用来补充说明用的，因为message通常会很短
 * TODO: resBody不应该保存在adminAlert下，而是应该放在tableData下
 */
function receiveTableBodyDataFail(message, resBody) {
  return {
    type: types.LOAD_TABLEDATA_FAIL,
    message,
    resBody
  };
}

function deleteTableDataSuccess(json) {
  return {
    type: types.DELETE_TABLEDATA_SUCCESS,
    data: json.data
  }
}

function deleteTableDataFail(message) {
  return {
    type: types.DELETE_TABLEDATA_FAIL,
    message
  }
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
  }
}

function updateTableDataFail(message, resBody) {
  return {
    type: types.TABLEDATA_UPDATE_FAILURE,
    message,
    resBody
  }
}

/**
 * 跳转到页
 */
export function gotoPage(startIndex, nextPage) {
  return (dispatch, getState) => {
    dispatch({
      type: types.GOTO_PAGE,
      startIndex,
      nextPage
    });
  }
}


/**
 * 获取会计平台子科目字段
 */

// 开始获取表格列模型
function requestChildSubjectFields() {
  return {
    type: types.LOAD_CHILDSUBJECTFIELDS
  }
}

// 获取表格列模型成功
function receiveChildSubjectFieldsSuccess(json, fields) {
  return {
    type: types.LOAD_CHILDSUBJECTFIELDS_SUCCESS,
    data: {
      fields
    }
  }
}

// 获取表格列模型失败
// message: 错误信息
// details: 比如HTTP response body，或者其他为了踢皮球而写的比较啰嗦的文字
function receiveChildSubjectFieldsFail(message, details) {
  return {
    type: types.LOAD_CHILDSUBJECTFIELDS_FAIL,
    message, details
  }
}

// 这个接口只获取表格体的数据
export function fetchTableBodyData(baseDocId, itemsPerPage, startIndex, nextPage) {
  return (dispatch, getState) => {
    dispatch(requestTableData());
    const { accountingSubject } = getState();

    var opts = {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      mode: "cors",
      body: JSON.stringify({
        conditions: [],
        begin: startIndex,
        groupnum: itemsPerPage
      })
    };
    appendCredentials(opts);

    var url = URL.getQueryURL(baseDocId);
    return fetch(url, opts)
      .then(response => {
        // TODO: HTTP状态检查，需要独立成helper function
        if (response.status >= 200 && response.status < 300) {
          return response;
        } else {
          var error = new Error(response.statusText);
          error.response = response;
          response.text().then(text => {
            dispatch(receiveTableBodyDataFail('后端返回的HTTP status code不是200', text));
          });
          throw error;
        }
      })
      .then(utils.parseJSON)
      .then(json => {
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
      }).catch(function (err) {
        console.log("fetch table body error:", err);
      });
  }
}

/**
 * 复合操作：获取表格数据并将页码设定为下一页
 */
export function fetchTableBodyDataAndGotoPage(baseDocId, itemsPerPage, startIndex, nextPage) {
  return (dispatch, getState) => {
    return dispatch(fetchTableBodyData(baseDocId, itemsPerPage, startIndex))
      .then(() => {
        return dispatch(gotoPage(startIndex, nextPage));
      });
  };
}

/**
 * 获取表格的列模型
 */
export function fetchTableColumnsModel(baseDocId) {
  return (dispatch) => {
    dispatch(requestChildSubjectFields());

    var opts = {
      method: 'post',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'//,
        //'Cookie': 'JSESSIONID=F0F88957BD3C1D6A07DFD36342DDA85F; JSESSIONID=D4D2196BE3223A695DA71EAED9AD93BD; _ga=GA1.1.359480174.1488286701; tenant_username=ST-36826-ojRQCYPdYRcN9IzSQa3H-cas01.example.org__635c1227-8bcb-4f65-b64d-4d07224101f5; tenant_token=YEI2AhHB42hgnqSuvuF8giN%2Bwjgm5LmzcXb0qRBee5sC8el7vf0Zi%2Bh%2B%2Bjn5HzH%2FKMhsx4DpzJsZNFZOvRffUg%3D%3D; SERVERID=aa7d5a15ad52d23df4ab9aa3ef3a436c|1488335283|1488335175'
      },
      mode: "cors",
      body: `doctype=${baseDocId}`
    };
    appendCredentials(opts);

    var url = `${URL.FICLOUDPUB_INITGRID_URL}`;
    return fetch(url, opts)
      .then(response => {
        // TODO: HTTP状态检查，需要独立成helper function
        if (response.status >= 200 && response.status < 300) {
          return response;
        } else {
          var error = new Error(response.statusText);
          error.response = response;
          response.text().then(text => {
            dispatch(receiveTableColumnsModelFail('后端返回的HTTP status code不是200', text));
          });
          throw error;
        }
      })
      .then(response => {
        return response.json();
      })
      .then(json => {
        if (json.success === true) {
          // 进行业务层的数据校验
          const [isValid, validationMessage] = utils.validation.tableColumnsModelData(json);
          if (isValid) {
            // 1. 删除不用的字段，按理说应该后端从response中删除掉的
            // 2. 修复后端json中的错别字，暂时在前端写死
            // 3. 后端数据类型使用int，前端使用string，暂时在前端写死
            // 4. 有些字段是必填项，暂时在前端写死,没有使用utils
            // 5. 有些字段需要隐藏，暂时在前端写死
            // 6. 有些字段的类型错误，暂时在前端写死新类型
            // 7. 参照字段，后端传来的是refinfocode，但是前端Refer组件使用的是refCode
            // 8. 添加参照的配置
            // 9. 枚举的存储结构和前端不一致，需要转化一下
            let fields = json.data
            /* 1 */ .filter(utils.shouldNotRemoveFields.bind(this, baseDocId))
            /* 1.1*/.filter(filterSubjectFileds)
            /* 2 */ .map(utils.fixFieldTypo)
            /* 3 */ .map(utils.convertDataType)
            /* 4 */ .map(setRequiredFields.bind(this, baseDocId))
            /* 5 */ .map(utils.setHiddenFields)
            /* 6 */ .map(utils.fixDataTypes.bind(this, baseDocId))
            /* 7 */ .map(utils.fixReferKey)
            /* 8 */ .map(utils.setReferFields.bind(this, URL.ReferDataURL, URL.ReferUserDataURL))
            /* 9 */ .map(utils.fixEnumData);
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
      .catch(function (err) {
        console.log("fetch table columns error:", err);
      });
  }
}


/**
 * 获取会计平台子科目的表格的列模型
 */
export function fetchChildSubjectTableColumnsModel(baseDocId) {
  if(baseDocId!=='accsubject') return;
  return (dispatch) => {
    dispatch(requestChildSubjectFields());

    var opts = {
      method: 'post',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'//,
        //'Cookie': 'JSESSIONID=F0F88957BD3C1D6A07DFD36342DDA85F; JSESSIONID=D4D2196BE3223A695DA71EAED9AD93BD; _ga=GA1.1.359480174.1488286701; tenant_username=ST-36826-ojRQCYPdYRcN9IzSQa3H-cas01.example.org__635c1227-8bcb-4f65-b64d-4d07224101f5; tenant_token=YEI2AhHB42hgnqSuvuF8giN%2Bwjgm5LmzcXb0qRBee5sC8el7vf0Zi%2Bh%2B%2Bjn5HzH%2FKMhsx4DpzJsZNFZOvRffUg%3D%3D; SERVERID=aa7d5a15ad52d23df4ab9aa3ef3a436c|1488335283|1488335175'
      },
      mode: "cors",
      body: `doctype=${baseDocId}`
    };
    appendCredentials(opts);

    var url = `${URL.FICLOUDPUB_INITGRID_URL}`;
    return fetch(url, opts)
      .then(response => {
        // TODO: HTTP状态检查，需要独立成helper function
        if (response.status >= 200 && response.status < 300) {
          return response;
        } else {
          var error = new Error(response.statusText);
          error.response = response;
          response.text().then(text => {
            dispatch(receiveChildSubjectFieldsFail('后端返回的HTTP status code不是200', text));
          });
          throw error;
        }
      })
      .then(response => {
        return response.json();
      })
      .then(json => {
        if (json.success === true) {
          // 进行业务层的数据校验
          const [isValid, validationMessage] = utils.validation.tableColumnsModelData(json);
          if (isValid) {
            // 1. 删除不用的字段，按理说应该后端从response中删除掉的
            // 2. 修复后端json中的错别字，暂时在前端写死
            // 3. 后端数据类型使用int，前端使用string，暂时在前端写死
            // 4. 有些字段是必填项，暂时在前端写死，没有使用utils
            // 5. 有些字段需要隐藏，暂时在前端写死
            // 6. 有些字段的类型错误，暂时在前端写死新类型
            // 7. 参照字段，后端传来的是refinfocode，但是前端Refer组件使用的是refCode
            // 8. 添加参照的配置
            // 9. 枚举的存储结构和前端不一致，需要转化一下
            // 10. 过滤会计平台子科目需要的字段
            let fields = json.data
            /* 1 */ .filter(utils.shouldNotRemoveFields.bind(this, baseDocId))
            /* 2 */ .map(utils.fixFieldTypo)
            /* 3 */ .map(utils.convertDataType)
            /* 4 */ .map(setRequiredFields.bind(this, baseDocId))
            /* 5 */ .map(utils.setHiddenFields)
            /* 6 */ .map(utils.fixDataTypes.bind(this, baseDocId))
            /* 7 */ .map(utils.fixReferKey)
            /* 8 */ .map(utils.setReferFields.bind(this, URL.ReferDataURL, URL.ReferUserDataURL))
            /* 9 */ .map(utils.fixEnumData)
            /* 10 */.filter(filterSubjectFileds);
            dispatch(receiveChildSubjectFieldsSuccess(json, fields));
          } else {
            dispatch(receiveChildSubjectFieldsFail(
              `虽然后端返回的success是true，而且客户端也获得到了JSON数据，
              但是数据校验方法提示说：“${validationMessage}”`,
              JSON.stringify(json.data, null, '  ')
            ));
          }

        } else {
          dispatch(receiveChildSubjectFieldsFail(
            '后端返回的success不是true', JSON.stringify(json, null, '  '))
          );
        }
      })
      .catch(function (err) {
        console.log("fetch table columns error:", err);
      });
  }
}


/**
 * 删除表格中的一行数据
 * @param {String} baseDocId 基础档案类型名称
 * @param {String} rowIdx 删除哪一行
 * @param {Object} rowData 被删除的行的数据对象
 */
export function deleteTableData(baseDocId, rowIdx, rowData) {
  return (dispatch, getState) => {
   // var { id, code } = rowData; // 40位主键 primary key
    var opts = {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      mode: "cors",
      body: JSON.stringify(rowData)
    };
    appendCredentials(opts);

    var url = URL.getDeleteURL(baseDocId);
    return fetch(url, opts)
      .then(response => {
        return response.json();
      }).then(json => {
        if( json.success ==  true ) {
          dispatch(deleteTableDataSuccess(json));
        }else{
          dispatch(deleteTableDataFail(json.message));
        }
      }).catch(function (err) {
        alert('删除时候出现错误');
        console.log("删除时候出现错误：", err);
      });
  }
}

/**
 * 创建会计平台子科目数据会调用到这里
 * rowIdx是可选参数，只有当修改表格数据（也就是点击表格每行最右侧的编辑按钮）
 * 的时候才会传这个参数
 * @param {String} baseDocId 基础档案类型名称，比如dept
 * @param {Array} fields 字段定义
 * @param {Object} formData 表单提交的数据
 * @param {Number} rowIndex 只有是修改了某一个行，才会传数字，否则传null
 */
export function addChildSubjectData(baseDocId, fields, formData, rowData, rowIdx) {
  return (dispatch, getState) => {
    var requestBodyObj = {};
    var requestNewVO = { ...formData };
    var requestUpVO = { ...rowData};

    // 注意：处理是有顺序的，不要乱调整
    // 2. 删除key:value中，当value为undefined/null
    requestNewVO = utils.removeEmpty(requestNewVO);
    requestUpVO = utils.removeEmpty(requestUpVO);

    requestBodyObj.newvo = requestNewVO;
    requestBodyObj.upvo = requestUpVO;

    function checkHTTPStatus(response) {
      // TODO: HTTP状态检查，需要独立成helper function
      if (response.status >= 200 && response.status < 300) {
        return response;
      } else {
        var error = new Error(response.statusText);
        error.response = response;
        response.text().then(text => {
          dispatch(updateTableDataFail(('后端返回的HTTP status code不是200', text)));
        });
        throw error;
      }
    }

    function processJSONResult(json) {
      if (json.success === true) {
        dispatch(updateTableDataSuccess(json, rowIdx));
      } else {
        dispatch(updateTableDataFail('获取表格数据失败，后端返回的success是false',
          json.message));
      }
    }

    var opts = {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      mode: "cors",
      body: JSON.stringify(requestBodyObj)
    };
    appendCredentials(opts);

    var url = URL.getAddURL(baseDocId);
    return fetch(url, opts)
      .then(checkHTTPStatus)
      .then(utils.parseJSON)
      .then(processJSONResult)
      .catch(function (err) {
        console.log("保存会计平台科目时候出现错误：", err);
      });
  }
}

/**
 * 创建表格数据都会调用到这里
 * rowIdx是可选参数，只有当修改表格数据（也就是点击表格每行最右侧的编辑按钮）
 * 的时候才会传这个参数
 * @param {String} baseDocId 基础档案类型名称，比如dept
 * @param {Array} fields 字段定义
 * @param {Object} formData 表单提交的数据
 * @param {Number} rowIndex 只有是修改了某一个行，才会传数字，否则传null
 */
export function saveTableData(baseDocId, fields, formData, rowIdx) {
  return (dispatch, getState) => {
    var requestBodyObj = {};
    var requestNewVO = { ...formData };

    // 注意：处理是有顺序的，不要乱调整
    // 1. 存储在formData中的参照是对象，往后端传的时候需要取出refer.selected[0].id传给后端。
    requestNewVO = processRefer(requestNewVO, fields);
    // 2. 删除key:value中，当value为undefined/null
    requestNewVO = utils.removeEmpty(requestNewVO);

    requestBodyObj.newvo = requestNewVO;

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
      fields.forEach(field => {
        if (field.type === 'ref') {
          var fieldId = field.id;
          var fieldObj = obj[fieldId];
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
      } else {
        var error = new Error(response.statusText);
        error.response = response;
        response.text().then(text => {
          dispatch(updateTableDataFail(('后端返回的HTTP status code不是200', text)));
        });
        throw error;
      }
    }

    function processJSONResult(json) {
      if (json.success === true) {
        dispatch(updateTableDataSuccess(json, rowIdx));
      } else {
        dispatch(updateTableDataFail('获取表格数据失败，后端返回的success是false',
          json.message));
      }
    }

    var opts = {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      mode: "cors",
      body: JSON.stringify(requestBodyObj)
    };
    appendCredentials(opts);

    var url = URL.getAddURL(baseDocId);
    return fetch(url, opts)
      .then(checkHTTPStatus)
      .then(utils.parseJSON)
      .then(processJSONResult)
      .catch(function (err) {
        console.log("保存基础档案时候出现错误：", err);
      });
  }
}


/**
 * 修改表格数据都会调用到这里
 * rowIdx是可选参数，只有当修改表格数据（也就是点击表格每行最右侧的编辑按钮）
 * 的时候才会传这个参数
 * @param {String} baseDocId 基础档案类型名称，比如dept
 * @param {Array} fields 字段定义
 * @param {Object} formData 表单提交的数据
 * @param {Number} rowIndex 只有是修改了某一个行，才会传数字，否则传null
 */
export function updateTableData(baseDocId, fields, formData, rowIdx) {
  return (dispatch, getState) => {
    var requestBodyObj = { ...formData };

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
      fields.forEach(field => {
        if (field.type === 'ref') {
          var fieldId = field.id;
          var fieldObj = obj[fieldId];
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
      } else {
        var error = new Error(response.statusText);
        error.response = response;
        response.text().then(text => {
          dispatch(updateTableDataFail(('后端返回的HTTP status code不是200', text)));
        });
        throw error;
      }
    }

    function processJSONResult(json) {
      if (json.success === true) {
        dispatch(updateTableDataSuccess(json, rowIdx));
      } else {
        dispatch(updateTableDataFail('获取表格数据失败，后端返回的success是false',
          json.message));
      }
    }

    var opts = {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      mode: "cors",
      body: JSON.stringify(requestBodyObj)
    };
    appendCredentials(opts);

    var url = URL.getUpdateURL(baseDocId);
    return fetch(url, opts)
      .then(checkHTTPStatus)
      .then(utils.parseJSON)
      .then(processJSONResult)
      .catch(function (err) {
        console.log("修改基础档案时候出现错误：", err);
      });
  }
}


/**
 * 复合操作：添加子科目并刷新表格
 */
export function addTableDataAndFetchTableBodyData(baseDocId, fields, formData, rowData, rowIdx, startIndex) {
  return (dispatch, getState) => {
    const { accountingSubject } = getState();
    return dispatch(addChildSubjectData(baseDocId, fields, formData, rowData, rowIdx)).then(() => {
      return dispatch(fetchTableBodyData(baseDocId, accountingSubject.itemsPerPage, accountingSubject.startIndex));
    });
  };
}

/**
 * 复合操作：创建/保存并刷新表格
 */
export function saveTableDataAndFetchTableBodyData(baseDocId, fields, formData, rowIdx, startIndex) {
  return (dispatch, getState) => {
    const { accountingSubject } = getState();
    return dispatch(saveTableData(baseDocId, fields, formData, rowIdx)).then(() => {
      return dispatch(fetchTableBodyData(baseDocId, accountingSubject.itemsPerPage, accountingSubject.startIndex));
    });
  };
}

/**
 * 复合操作：更新并刷新表格
 */
export function updateTableDataAndFetchTableBodyData(baseDocId, fields, formData, rowIdx, startIndex) {
  return (dispatch, getState) => {
    const { accountingSubject } = getState();
    return dispatch(updateTableData(baseDocId, fields, formData, rowIdx)).then(() => {
      return dispatch(fetchTableBodyData(baseDocId, accountingSubject.itemsPerPage, accountingSubject.startIndex));
    });
  };
}

/**
 * 复合操作：删除并刷新表格
 */
export function deleteTableDataAndFetchTableBodyData(baseDocId, rowIdx, rowData, startIndex) {
  return (dispatch, getState) => {
    const { accountingSubject } = getState();
    return dispatch(deleteTableData(baseDocId, rowIdx, rowData)).then(() => {
      return dispatch(fetchTableBodyData(baseDocId, accountingSubject.itemsPerPage, accountingSubject.startIndex));
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
  return (dispatch, getState) => {
    dispatch({
      type: types.SHOW_EDIT_DIALOG,
      openDialog: true,
      formData: rowData,
      rowIdx
    })
  };
}

export function closeEditDialog() {
  return (dispatch, getState) => {
    dispatch({
      type: types.EDIT_DIALOG_CLOSE,
      openDialog: false,
      formData: {},
      rowIdx: null
    })
  };
}

export function updateEditFormFieldValue(index, fieldModel, value) {
  return (dispatch, getState) => {
    // TODO(chenyangf@yonyou.com): Dont touch state when value not changed.
    dispatch({
      type: types.UPDATE_EDIT_FORM_FIELD_VALUE,
      id: fieldModel.id,
      payload: value
    });
  };
};

export function initEditFormData(editFormData) {
  return dispatch => {
    dispatch({
      type: types.ARCH_INIT_EDIT_FORM_DATA,
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
    const { accountingSubject: { editFormData } } = getState();
    const idField = editFormData.find(field => field.label === 'id');
    const options = {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editFormData)
    };
    appendCredentials(options);
    return fetch(`/api/arch/${idField.value}`, options)
      .then(utils.checkStatus)
      .then(utils.parseJSON)
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

// child dialog

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
export function showChildDialog(rowIdx, rowData) {
  return (dispatch, getState) => {
    dispatch({
      type: types.SHOW_CHILD_DIALOG,
      openDialog: true,
      formData: rowData,
      rowIdx
    })
  };
}

export function closeChildDialog() {
  return (dispatch, getState) => {
    dispatch({
      type: types.CHILD_DIALOG_CLOSE,
      openDialog: false,
      formData: {},
      rowIdx: null
    })
  };
}

export function updateChildFormFieldValue(index, fieldModel, value) {
  return (dispatch, getState) => {
    // TODO(chenyangf@yonyou.com): Dont touch state when value not changed.
    dispatch({
      type: types.UPDATE_CHILD_FORM_FIELD_VALUE,
      id: fieldModel.id,
      payload: value
    });
  };
};

export function initChildFormData(editFormData) {
  return dispatch => {
    dispatch({
      type: types.ARCH_INIT_CHILD_FORM_DATA,
      editFormData
    });
  };
};

export function submitChildForm() {
  return (dispatch, getState) => {
    dispatch({
      type: types.SUBMIT_CHILD_FORM
    });
    const processResult = result => {
      result.error ?
        dispatch({
          type: types.SUBMIT_CHILD_FORM_FAIL,
          bsStyle: 'danger',
          message: result.error.message
        })
        :
        dispatch({
          type: types.SUBMIT_CHILD_FORM_SUCCESS,
          bsStyle: 'success',
          message: '提交成功'
        })
    };
    const { accountingSubject: { editFormData } } = getState();
    const idField = editFormData.find(field => field.label === 'id');
    const options = {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editFormData)
    };
    appendCredentials(options);
    return fetch(`/api/arch/${idField.value}`, options)
      .then(utils.checkStatus)
      .then(utils.parseJSON)
      .then(processResult)
      .catch(error => {
        dispatch({
          type: types.SUBMIT_CHILD_FORM_FAIL,
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
    const { accountingSubject: { createFormData } } = getState();
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(createFormData)
    };
    appendCredentials(options);
    return fetch(`/api/arch`, options)
      .then(utils.checkStatus)
      .then(utils.parseJSON)
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
    const { accountingSubject: { fields } } = getState();
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
};

// 页面上的消息框

function updateErrorMessages(message) {
  return {
    type: types.ERROR_MESSAGES_UPDATE,
    message
  }
}

/**
 * 会计科目平台中添加子科目时 过滤掉不需要的字段
 * 目前vr段只需要vr1,vr2,vr3
 * @param field
 * @returns {boolean}
 */
function filterChildSubFileds({...field}) {
  if(field.id === 'code' || field.id === 'name' || field.id === 'direction') {
    return true;
  }/*else if(/^vr\d+/g.exec(field.id) !== null) {
   return true;
   }*/else if(field.id === 'vr1' || field.id === 'vr2' || field.id === 'vr3') {
    return true;
  } else {
    return false;
  }
}

/**
 * 会计科目平台过滤掉不需要的字段
 * 目前vr段只需要vr1,vr2,vr3
 * @param field
 * @returns {boolean}
 */
function filterSubjectFileds({...field}) {
  if(field.id === 'id' || field.id === 'code' || field.id === 'name' || field.id === 'direction' || field.id === 'accproperty' || field.id === 'enable'  || field.id === 'description'  || field.id === 'vr1' || field.id === 'vr2' || field.id === 'vr3' ) {
    return true;
  } else {
    return false;
  }
}


/**
 * 根据参照的类型来添加参照的config object
 * TODO 需要转移到utils.js中
 */
function setReferFields(ReferDataURL, ReferUserDataURL, field) {
  const getReferConfig = fieldDocType => {
    const config = {
      referConditions: {
        refCode: fieldDocType,
        refType: 'table',
      }
    };
    if (fieldDocType === 'user') {
      config.referDataUrl = ReferUserDataURL;
    } else {
      config.referDataUrl = ReferDataURL;
    }
    return config;
  };
  if (field.type === 'ref') {
    field.referConfig = getReferConfig(field.refCode);
  }
  return field;
}

/**
 * 指定必须输入的字段
 */
function setRequiredFields(baseDocId, {...field}) {
  const data = {
    accsubject: {
      code: true, // dept的code字段是必输字段
      name: true,
      accproperty: true
    }
  };
  if (data[baseDocId] && data[baseDocId][field.id] === true) {
    if (!field.validators) {
      field.validators = [];
    }
    field.validators.push({
      type: 'required'
    });
  }
  return field;
}

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

// 对话框中的消息框

export function showFormAlert() {
  return dispatch => {
    dispatch({
      type: types.FORM_ALERT_OPEN
    });
  };
};

export function hideFormAlert() {
  return dispatch => {
    dispatch({
      type: types.FORM_ALERT_CLOSE
    });
  };
};

export function updateReferFields(code, fieldIndex) {
  return (dispatch, getState) => {
    const { accountingSubject } = getState();
    // console.log('xx', accountingSubject.fields[4].id);
    dispatch({
      type: types.REFER_FIELDS_UPDATE,
      fieldIndex,
      code
    });
  }
}
