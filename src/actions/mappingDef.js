// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@@@@@@@@@@@@@8:@@@@@@@@@@@@@@@@@@@@@@@@@@@@::@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@@@@@@@@@@@@@   @@@@@@@@@@@@@@@@@@@@@@@@@@@  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@8                         @@@:                          O@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@8  @@@@@@@@@@cO@@@@@@@@@@@@@@@@@@@@@@@.  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@8  @@@@  @@@@  @@@O  8@@@@@@@@@@@@@@@   @@@@@@@.   @@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@8  @@@  o@@@  c@@@@@o  @@@@@@@@@@8@8  Cooc:.         c@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@O  @@                    @@@@@:       .:cCO8@@@@@@@@8   @@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@O  @@@@@@@@  @@@@@@@@@@@@@@@@@@@@@@@. c@@@@@@@@  O@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@c  @@@@@@@  c@@@@@@@@@@@@@@@@@@@@@@@. c@@@@@@@@  O@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@  :@@@@@@             C@@@@@@                           .@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@  O@@@@8  .  @@@@@:  @@@@@@@@@@@@@@@  8@@@@@@@@  O@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@  @@@@   @@@   C.  c@@@@@@@@@@@@@@@   @@@@@@@@@  O@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@. .@    @@@@@@      @@@@@@@@@@@@@@   O@@@@@@@@@@  O@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@8  @@@O@@@.     @@@@:      o@@@C    8@@@@@@@@@@@@  O@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@@@@@@@@@c8@@@@@@@@@@@@@88@@@@@o@@@@@@@@@@@@@@@@oo8@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

/**
 * 转换规则定义
 * mapdef.md
 */

import fetch from 'isomorphic-fetch';

// help functions
import * as utils from './utils';

// 后端接口URL
import * as URL from '../constants/URLs';

/**
 * 获取表格的列模型
 */

export const TABLE_COLUMNS_MODEL_REQUEST = 'TABLE_COLUMNS_MODEL_REQUEST';
export const TABLE_COLUMNS_MODEL_SUCCESS = 'TABLE_COLUMNS_MODEL_SUCCESS';
export const TABLE_COLUMNS_MODEL_FAILURE = 'TABLE_COLUMNS_MODEL_FAILURE';

export function fetchTableColumnsModel(baseDocId) {
  // use `callAPIMiddleware`
  return {
    types: [
      TABLE_COLUMNS_MODEL_REQUEST,
      TABLE_COLUMNS_MODEL_SUCCESS,
      TABLE_COLUMNS_MODEL_FAILURE
    ],
    // Check the cache (optional):
    // shouldCallAPI: (state) => !state.posts[userId],
    callAPI: () => {
      let opts = utils.getFetchFormOpts(`doctype=${baseDocId}`);
      const url = `${URL.FICLOUDPUB_INITGRID_URL}`;
      return fetch(url, opts)
        .then(utils.checkHTTPStatus)
        .then(utils.parseJSON)
        .then((resObj) => {
          if (resObj.success === true) {
            // 进行业务层的数据校验
            const [isValid, validationMessage] = utils.validation.tableColumnsModelData(resObj);
            if (isValid) {
              // 1. 删除不用的字段，按理说应该后端从response中删除掉的
              // 2. 修复后端json中的错别字，暂时在前端写死
              // 3. 后端数据类型使用int，前端使用string，暂时在前端写死
              // 4. 有些字段是必填项，暂时在前端写死
              // 5. 有些字段需要隐藏，暂时在前端写死
              // 6. 有些字段的类型错误，暂时在前端写死新类型
              // 7. 参照字段，后端传来的是refinfocode，但是前端Refer组件使用的是refCode
              // 8. 添加参照的配置
              // 9. 自定义布尔型字段的格式化
              let fieldsModel = resObj.data
                /* 1 */ .filter(utils.shouldNotRemoveFields.bind(this, baseDocId))
                /* 2 */ .map(utils.fixFieldTypo)
                /* 3 */ .map(utils.convertDataType)
                /* 4 */ .map(utils.setRequiredFields.bind(this, baseDocId))
                /* 5 */ .map(utils.setHiddenFields)
                /* 6 */ .map(utils.fixDataTypes.bind(this, baseDocId))
                /* 7 */ .map(utils.fixReferKey)
                /* 8 */ .map(utils.setReferFields.bind(this, URL.ReferDataURL,
                          URL.ReferUserDataURL))
                /* 9 */ .map(utils.setTableCellFormatter);

              // 初始化表单的默认数据
              const formDefaultData = utils.getFormDefaultData(fieldsModel);

              return {
                fieldsModel,
                formDefaultData
              };
            }

            throw new utils.InvalidJSONException(`虽然后端返回的success是true，
              而且客户端也获得到了JSON数据，但是数据校验方法提示说：“${validationMessage}”`);
          } else {
            throw new utils.SuccessFalseException(resObj.message);
          }
        });
    }
  };
}

/**
 * 获取实体模型
 */

export const MAPPING_DEF_TABLE_BODY_DATA_REQUEST = 'MAPPING_DEF_TABLE_BODY_DATA_REQUEST';
export const MAPPING_DEF_TABLE_BODY_DATA_SUCCESS = 'MAPPING_DEF_TABLE_BODY_DATA_SUCCESS';
export const MAPPING_DEF_TABLE_BODY_DATA_FAILURE = 'MAPPING_DEF_TABLE_BODY_DATA_FAILURE';

export function fetchTableBodyData(itemsPerPage, startIndex) {
  // use `callAPIMiddleware`
  return {
    types: [
      MAPPING_DEF_TABLE_BODY_DATA_REQUEST,
      MAPPING_DEF_TABLE_BODY_DATA_SUCCESS,
      MAPPING_DEF_TABLE_BODY_DATA_FAILURE
    ],
    // Check the cache (optional):
    // shouldCallAPI: (state) => !state.posts[userId],
    callAPI: () => {
      let opts = utils.getFetchOpts({
        conditions: [],
        paras: [],
        fields: [],
        begin: startIndex,
        groupnum: itemsPerPage
      });
      let url = `${URL.MAPPING_DEF_QUERY_URL}`;
      return fetch(url, opts)
        .then(utils.checkHTTPStatus)
        .then(utils.parseJSON)
        .then((resObj) => {
          if (resObj.success !== true) {
            throw new utils.SuccessFalseException(resObj.message);
          }
          return {
            tableData: resObj.data.data,
            totalDataCount: resObj.totalnum,
            totalPage: Math.ceil(resObj.totalnum / itemsPerPage)
          };
        });
    }
  };
}

/**
 * 表格，新增/修改操作
 */

export const MAPPING_DEF_TABLE_BODY_DATA_UPDATE_REQUEST = 'MAPPING_DEF_TABLE_BODY_DATA_UPDATE_REQUEST';
export const MAPPING_DEF_TABLE_BODY_DATA_UPDATE_SUCCESS = 'MAPPING_DEF_TABLE_BODY_DATA_UPDATE_SUCCESS';
export const MAPPING_DEF_TABLE_BODY_DATA_UPDATE_FAILURE = 'MAPPING_DEF_TABLE_BODY_DATA_UPDATE_FAILURE';

/**
 * @param {Object} formData 表单提交的数据
 *                 当没有id的时候，则创建新数据
 */
export function updateTableBodyData(formData) {
  // use `callAPIMiddleware`
  return {
    types: [
      MAPPING_DEF_TABLE_BODY_DATA_UPDATE_REQUEST,
      MAPPING_DEF_TABLE_BODY_DATA_UPDATE_SUCCESS,
      MAPPING_DEF_TABLE_BODY_DATA_UPDATE_FAILURE
    ],
    callAPI: () => {
      let opts = utils.getFetchOpts({ ...formData });
      const url = URL.MAPPING_DEF_SAVE_URL;
      return fetch(url, opts)
        .then(utils.checkHTTPStatus)
        .then(utils.parseJSON)
        .then((resObj) => {
          if (resObj.success !== true) {
            throw new utils.SuccessFalseException(resObj.message);
          }
        });
    }
  };
}

/**
 * 表格，删除操作
 */

export const MAPPING_DEF_TABLE_BODY_DATA_DELETE_REQUEST = 'MAPPING_DEF_TABLE_BODY_DATA_DELETE_REQUEST';
export const MAPPING_DEF_TABLE_BODY_DATA_DELETE_SUCCESS = 'MAPPING_DEF_TABLE_BODY_DATA_DELETE_SUCCESS';
export const MAPPING_DEF_TABLE_BODY_DATA_DELETE_FAILURE = 'MAPPING_DEF_TABLE_BODY_DATA_DELETE_FAILURE';

/**
 * @param {Object} rowObj 删除行的数据
 */
export function deleteTableBodyData(rowObj) {
  // use `callAPIMiddleware`
  return {
    types: [
      MAPPING_DEF_TABLE_BODY_DATA_DELETE_REQUEST,
      MAPPING_DEF_TABLE_BODY_DATA_DELETE_SUCCESS,
      MAPPING_DEF_TABLE_BODY_DATA_DELETE_FAILURE
    ],
    callAPI: () => {
      let opts = utils.getFetchOpts(rowObj);
      const url = URL.MAPPING_DEF_DELETE_URL;
      return fetch(url, opts)
        .then(utils.checkHTTPStatus)
        .then(utils.parseJSON)
        .then((resObj) => {
          if (resObj.success !== true) {
            throw new utils.SuccessFalseException(resObj.message);
          }
        });
    }
  };
}

/**
 * 用于显示错误的tooltip
 */

export const SHOW_PAGE_ALERT = 'SHOW_PAGE_ALERT';

/**
 * @param {Boolean} show 是否显示
 */
export function showPageAlert(show) {
  return (dispatch) => {
    dispatch({
      type: SHOW_PAGE_ALERT,
      show
    });
  };
}

/**
 * 创建/编辑对话框
 */

export const MAPPING_DEF_EDIT_DIALOG_SHOW = 'MAPPING_DEF_EDIT_DIALOG_SHOW';
export const MAPPING_DEF_CREATE_DIALOG_SHOW = 'MAPPING_DEF_CREATE_DIALOG_SHOW';

/**
 * @param {boolean} show 是否显示
 * @param {Number} [rowIdx=null] 编辑行的index
 * @param {Object} [editFormData={}] 编辑行的数据，用于填充表单
 */
export const showEditDialog =
  (show, rowIdx = null, editFormData = {}) => dispatch => dispatch({
    type: MAPPING_DEF_EDIT_DIALOG_SHOW,
    show,
    rowIdx,
    editFormData
  });

/**
 * @param {Boolean} show 显示/隐藏对话框
 * @param {Object} [formData={}] 需要填充到表单中的数据
 */
export const showCreateDialog =
  (show, createFormData = {}) => dispatch => dispatch({
    type: MAPPING_DEF_CREATE_DIALOG_SHOW,
    show,
    createFormData
  });

/**
 * 复合操作
 */

// 更新，再刷新表格，再隐藏对话框
export const updateTableBodyDataAndFetchTableBodyData = formData => (dispatch, getState) => {
  const { mappingDef } = getState();
  return dispatch(updateTableBodyData(formData))
    .then(() => dispatch(fetchTableBodyData(mappingDef.itemsPerPage, mappingDef.startIndex)))
    .then(() => dispatch(showEditDialog(false)));
};

// 创建，再刷新表格，再隐藏对话框
export const createTableBodyDataAndFetchTableBodyData = formData => (dispatch, getState) => {
  const { mappingDef } = getState();
  return dispatch(updateTableBodyData(formData))
    .then(() => dispatch(fetchTableBodyData(mappingDef.itemsPerPage, mappingDef.startIndex)))
    .then(() => dispatch(showCreateDialog(false)));
};

/**
 * 删除，再刷新表格
 * @param {Object} rowObj
 */
export const deleteTableBodyDataAndFetchTableBodyData = rowObj => (dispatch, getState) => {
  const { mappingDef } = getState();
  return dispatch(deleteTableBodyData(rowObj))
    .then(() => dispatch(fetchTableBodyData(mappingDef.itemsPerPage, mappingDef.startIndex)));
};
