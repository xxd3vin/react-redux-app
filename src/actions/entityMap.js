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
 * 【友账表】 会计平台 - 实体映射
 */

import fetch from 'isomorphic-fetch';

// help functions
import * as utils from './utils';
import * as treeUtils from './utils.tree';

// 后端接口URL
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
 * 当刚进入页面时候，清理上次保留的状态，如果存在的话
 */

export const ENTITY_MAP_STATE_CLEAN = 'ENTITY_MAP_STATE_CLEAN';
export function cleanPageState() {
  return (dispatch) => {
    dispatch({
      type: ENTITY_MAP_STATE_CLEAN
    });
  };
}

/**
 * 左边的树
 */

export const LEFT_TREE_REQUEST = 'LEFT_TREE_REQUEST';
export const LEFT_TREE_SUCCESS = 'LEFT_TREE_SUCCESS';
export const LEFT_TREE_FAILURE = 'LEFT_TREE_FAILURE';

/**
 * 获取左边的树
 * @param {String} billTypeCode
 * @param {String} mappingDefId
 */
export function fetchLeftTree(billTypeCode, mappingDefId) {
  // use `callAPIMiddleware`
  return {
    types: [LEFT_TREE_REQUEST, LEFT_TREE_SUCCESS, LEFT_TREE_FAILURE],
    // Check the cache (optional):
    // shouldCallAPI: (state) => !state.posts[userId],
    callAPI: () => {
      let opts = {
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({
          billtypecode: billTypeCode, // "C0"
          mappingdefid: mappingDefId // "1"
        })
      };
      appendCredentials(opts);

      let url = `${URL.OUTER_ENTITY_TREE_URL}`;

      return fetch(url, opts)
        .then(utils.checkHTTPStatus)
        .then(utils.parseJSON)
        .then((resObj) => {
          if (resObj.success !== true) {
            throw new utils.SuccessFalseException(resObj.message);
          }
          return resObj;
        });
    }
  };
}

/**
 * 获取左边树上指定节点的子节点，用于节点展开的查询
 */

export const TEMPLATE_NODE_REQUEST = 'TEMPLATE_NODE_REQUEST';
export const TEMPLATE_NODE_SUCCESS = 'TEMPLATE_NODE_SUCCESS';
export const TEMPLATE_NODE_FAILURE = 'TEMPLATE_NODE_FAILURE';

export function fetchLeftTreeNodeChildren(key) {
  // use `callAPIMiddleware`
  return {
    types: [TEMPLATE_NODE_REQUEST, TEMPLATE_NODE_SUCCESS, TEMPLATE_NODE_FAILURE],
    // Check the cache (optional):
    shouldCallAPI: state => !treeUtils.hasChildren(state.entityMap.treeData, key),
    callAPI: (state) => {
      let opts = {
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({
          key // 0-1
        })
      };
      appendCredentials(opts);

      let url = `${URL.OUTER_ENTITY_TREE_NODE_CHILDREN_URL}`;

      return fetch(url, opts)
        .then(response => response.json())
        .then((resObj) => {
          // 处理success: false

          // 从store中取得树数据，然后添加节点，再保存回store中
          const treeData = [...state.entityMap.treeData];
          const newTreeData = treeUtils.genNewTreeData(treeData, key, resObj.data/* , 9999 */);

          return {
            treeData: newTreeData
          };
        });
    }
  };
}

/**
 * 从后端获取指定节点的数据，用于填充右侧的表格和表单
 */

export const ENTITY_MAP_TREE_NODE_DATA_REQUEST = 'ENTITY_TREE_NODE_DATA_REQUEST';
export const ENTITY_MAP_TREE_NODE_DATA_SUCCESS = 'ENTITY_TREE_NODE_DATA_SUCCESS';
export const ENTITY_MAP_TREE_NODE_DATA_FAILURE = 'ENTITY_TREE_NODE_DATA_FAILURE';

/**
 * 根据一个节点提供的信息，包括title和key，发送请求获取该节点的数据，用于显示
 * 右侧的表单
 * @param {Object} treeNodeData 节点数据，比如
 * ```json
 * {
 *   "parentKey": null,
 *   "title": "总账凭证:友账簿凭证",
 *   "key": "@E@:G001ZM0000BILLTYPE000000000000000003",
 *   "isLeaf": false,
 *   "infoKey": "1"
 * }
 * ```
 */
export function fetchTreeNodeData(treeNodeData, baseDocId = 'entity') {
  // use `callAPIMiddleware`
  return {
    types: [
      ENTITY_MAP_TREE_NODE_DATA_REQUEST,
      ENTITY_MAP_TREE_NODE_DATA_SUCCESS,
      ENTITY_MAP_TREE_NODE_DATA_FAILURE
    ],
    // Check the cache (optional):
    // shouldCallAPI: (state) => !state.posts[userId],
    callAPI: () => {
      const opts = {
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify(treeNodeData)
      };
      appendCredentials(opts);
      const url = `${URL.OUTER_ENTITY_TREE_NODE_DATA_URL}`;

      return fetch(url, opts)
        .then(utils.checkHTTPStatus)
        .then(utils.parseJSON)
        .then((resObj) => {
          if (resObj.success !== true) {
            throw new utils.SuccessFalseException(resObj.message);
          }

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
          let fieldsModel = resObj.data.head
            /*  1 */ .filter(utils.shouldNotRemoveFields.bind(this, baseDocId))
            /*  2 */ .map(utils.fixFieldTypo)
            /*  3 */ .map(utils.convertDataType
                        .bind(this, [{
                          code: 5, name: 'custom' }]
                        )
                      )
            /*  4 */ .map(utils.setRequiredFields.bind(this, baseDocId))
            /*  5 */ .map(utils.setHiddenFields)
            /*  6 */ .map(utils.fixDataTypes.bind(this, baseDocId))
            /*  7 */ .map(utils.fixReferKey)
            /*  8 */ .map(utils.setReferFields.bind(this, URL.ReferDataURL,
              URL.ReferUserDataURL))
            /*  9 */ .map(utils.fixEnumData)
            /* 10 */ .map(utils.setLengthValidation);

          return {
            fieldsModel,
            tableBodyData: resObj.data.body
          };
        });
    }
  };
}

/**
 * 记录哪个节点被点击了
 */
export const ENTITYMAP_CLICKED_NODE_DATA_UPDATE = 'ENTITYMAP_CLICKED_NODE_DATA_UPDATE';
export const saveClickedNodeData = treeNodeData => dispatch => dispatch({
  type: ENTITYMAP_CLICKED_NODE_DATA_UPDATE,
  treeNodeData
});

export const ENTITY_MAP_EDIT_DIALOG_SHOW = 'ENTITY_MAP_EDIT_DIALOG_SHOW';

/**
 * 显示/隐藏编辑/创建窗口
 * @param {boolean} show 是否显示
 * @param {Number} [rowIdx=null] 编辑行的index
 * @param {Object} [editFormData={}] 编辑行的数据，用于填充表单
 */
export function showEditDialog(show, rowIdx = null, editFormData = {}) {
  return (dispatch) => {
    dispatch({
      type: ENTITY_MAP_EDIT_DIALOG_SHOW,
      show,
      rowIdx,
      editFormData
    });
  };
}

export const ENTITY_MAP_CREATE_DIALOG_SHOW = 'ENTITY_MAP_CREATE_DIALOG_SHOW';

/**
 * @param {Boolean} show 显示/隐藏对话框
 * @param {Object} [formData={}] 需要填充到表单中的数据
 */
export const showCreateDialog = (show, formData = {}) => dispatch => dispatch({
  type: ENTITY_MAP_CREATE_DIALOG_SHOW,
  show,
  formData
});

/**
 * 右侧表格，保存操作，然后关闭对话框
 */

export const TREE_NODE_DATA_UPDATE_REQUEST = 'TREE_NODE_DATA_UPDATE_REQUEST';
export const TREE_NODE_DATA_UPDATE_SUCCESS = 'TREE_NODE_DATA_UPDATE_SUCCESS';
export const TREE_NODE_DATA_UPDATE_FAILURE = 'TREE_NODE_DATA_UPDATE_FAILURE';

/**
 * @param {Object} formData 表单提交的数据
 */
export function updateTreeNodeData(formData) {
  // use `callAPIMiddleware`
  return {
    types: [
      TREE_NODE_DATA_UPDATE_REQUEST,
      TREE_NODE_DATA_UPDATE_SUCCESS,
      TREE_NODE_DATA_UPDATE_FAILURE
    ],
    callAPI: () => {
      let requestBodyObj = { ...formData };
      let opts = {
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify(requestBodyObj)
      };
      appendCredentials(opts);

      const url = URL.OUTER_ENTITY_TREE_UPDATE_NODE_DATA_URL;
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
 * 右侧表格，新建操作
 */

export const TREE_NODE_DATA_ADD_REQUEST = 'TREE_NODE_DATA_ADD_REQUEST';
export const TREE_NODE_DATA_ADD_SUCCESS = 'TREE_NODE_DATA_ADD_SUCCESS';
export const TREE_NODE_DATA_ADD_FAILURE = 'TREE_NODE_DATA_ADD_FAILURE';

/**
 * @param {Object} formData 表单提交的数据
 */
export const addTreeNodeData = formData => ({
  types: [
    TREE_NODE_DATA_ADD_REQUEST,
    TREE_NODE_DATA_ADD_SUCCESS,
    TREE_NODE_DATA_ADD_FAILURE
  ],
  callAPI: () => {
    let opts = {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      mode: 'cors',
      body: JSON.stringify({ ...formData })
    };
    appendCredentials(opts);

    const url = URL.OUTER_ENTITY_TREE_ADD_NODE_DATA_URL;
    return fetch(url, opts)
      .then(utils.checkHTTPStatus)
      .then(utils.parseJSON)
      .then((resObj) => {
        if (resObj.success !== true) {
          throw new utils.SuccessFalseException(resObj.message);
        }
      });
  }
});

/**
 * 右侧表格，删除操作
 */

export const TREE_NODE_DATA_DEL_REQUEST = 'TREE_NODE_DATA_DEL_REQUEST';
export const TREE_NODE_DATA_DEL_SUCCESS = 'TREE_NODE_DATA_DEL_SUCCESS';
export const TREE_NODE_DATA_DEL_FAILURE = 'TREE_NODE_DATA_DEL_FAILURE';

/**
 * @param {Object} rowObj
 */
export function delTreeNodeData(rowObj) {
  // use `callAPIMiddleware`
  return {
    types: [
      TREE_NODE_DATA_DEL_REQUEST,
      TREE_NODE_DATA_DEL_SUCCESS,
      TREE_NODE_DATA_DEL_FAILURE
    ],
    callAPI: () => {
      const { id } = rowObj;
      let opts = {
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({ id })
      };
      appendCredentials(opts);

      const url = URL.OUTER_ENTITY_TREE_DEL_NODE_DATA_URL;
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
 * 错误提示
 */

export const PAGE_ALERT_SHOW = 'PAGE_ALERT_SHOW';
export const FORM_ALERT_SHOW = 'FORM_ALERT_SHOW';

export function showPageAlert(show, message) {
  return (dispatch) => {
    dispatch({
      type: PAGE_ALERT_SHOW,
      show,
      message
    });
  };
}

export const showFormAlert = (show, message) => dispatch => dispatch({
  type: FORM_ALERT_SHOW,
  show,
  message
});

/**
 * 复合操作：获取节点数据（用于填充右侧表格）并记录选中的节点
 */
export const fetchTreeNodeDataAndSaveClickedNodeData = treeNodeData => dispatch =>
  dispatch(
    fetchTreeNodeData(treeNodeData)
  )
  .then(() => dispatch(saveClickedNodeData(treeNodeData)));

/**
 * 复合操作：创建并刷新表格
 */
export const addTreeNodeDataAndFetchTreeNodeData = formData => (dispatch, getState) => {
  const { entityMap } = getState();
  return dispatch(addTreeNodeData(formData))
    .then(() => {
      dispatch(fetchTreeNodeData(entityMap.clickedTreeNodeData));
      dispatch(showCreateDialog(false));
    })
    .catch(() => {
      // 这里可以处理addTreeNodeData中的异常
    });
};

/**
 * 复合操作：更新并刷新表格
 */
export const updateTreeNodeDataAndFetchTreeNodeData = formData => (dispatch, getState) => {
  const { entityMap } = getState();
  return dispatch(updateTreeNodeData(formData))
    .then(() => {
      dispatch(fetchTreeNodeData(entityMap.clickedTreeNodeData));
      dispatch(showEditDialog(false));
    })
    .catch(() => {
      // 这里可以处理updateTreeNodeData中的异常
    });
};

/**
 * 复合操作：删除并刷新表格
 * @param {Object} rowObj
 */
export const delTreeNodeDataAndFetchTreeNodeData = rowObj => (dispatch, getState) => {
  const { entityMap } = getState();
  return dispatch(delTreeNodeData(rowObj))
    .then(() => dispatch(fetchTreeNodeData(entityMap.clickedTreeNodeData)));
};
