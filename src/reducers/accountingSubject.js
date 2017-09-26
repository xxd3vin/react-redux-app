/**
 * Created by Tiger on 17/3/23.
 */
import update from 'react-addons-update';
import { combineReducers } from 'redux';

import {
  LOAD_TABLEDATA, LOAD_TABLEDATA_SUCCESS, LOAD_TABLEDATA_FAIL,
  LOAD_TABLECOLUMNS, LOAD_TABLECOLUMNS_SUCCESS, LOAD_TABLECOLUMNS_FAIL,
  DELETE_TABLEDATA, DELETE_TABLEDATA_SUCCESS, DELETE_TABLEDATA_FAIL,
  TABLEDATA_UPDATE, TABLEDATA_UPDATE_SUCCESS, TABLEDATA_UPDATE_FAILURE,
  CHANGE_SELECTED_ROWS,

  LOAD_CHILDSUBJECTFIELDS, LOAD_CHILDSUBJECTFIELDS_SUCCESS,
  LOAD_CHILDSUBJECTFIELDS_FAIL,

  SHOW_EDIT_DIALOG, EDIT_DIALOG_CLOSE,
  ARCH_INIT_EDIT_FORM_DATA, UPDATE_EDIT_FORM_FIELD_VALUE,
  SUBMIT_EDIT_FORM, SUBMIT_EDIT_FORM_SUCCESS, SUBMIT_EDIT_FORM_FAIL,

  SHOW_CHILD_DIALOG, CHILD_DIALOG_CLOSE,
  ARCH_INIT_CHILD_FORM_DATA, UPDATE_CHILD_FORM_FIELD_VALUE,
  SUBMIT_CHILD_FORM, SUBMIT_CHILD_FORM_SUCCESS, SUBMIT_CHILD_FORM_FAIL,

  SHOW_CREATE_DIALOG, HIDE_CREATE_DIALOG,
  INIT_CREATE_FORM_DATA, UPDATE_CREATE_FORM_FIELD_VALUE,
  SUBMIT_CREATE_FORM, SUBMIT_CREATE_FORM_SUCCESS, SUBMIT_CREATE_FORM_FAIL,

  SHOW_ADMIN_ALERT, HIDE_ADMIN_ALERT,
  FORM_ALERT_OPEN, FORM_ALERT_CLOSE,

  ERROR_MESSAGES_UPDATE,
  GOTO_PAGE,
  REFER_FIELDS_UPDATE
} from '../constants/ActionTypes';

const initState = {
  itemsPerPage: 15, // TODO 常量不应该放在这里
  startIndex: 0,
  activePage: 1,
  loaded: false,
  tableData: [],
  fields: [],
  childSubjectFields: [],
  totalDataCount: 0,
  selectedRows: {},
  editDialog: {
    show: false,
    formData: [],
    rowIdx: null // 当前编辑框对应表格的行index
  },
  editFormData: {},
  createDialog: {
    show: false
  },
  createFormData: [],
  childDialog: {
    show: false,
    formData: [],
    rowIdx: null // 当前编辑框对应表格的行index
  },
  childFormData: {},
  adminAlert: {
    show: false,
    error: {
      code: 0,
      bsStyle: 'danger', // one of: "success", "warning", "danger", "info"
      message: '',
      resBody: '' // 需要改成details，因为这里不仅仅会填写response body
    }
  },
  // 当前页面所有的错误信息都扔进来
  errorMessages: [],
  // 当表单提交失败的时候，显示错误信息
  formAlert: {
    show: false,
    error: {
      code: 0,
      bsStyle: 'danger', // one of: "success", "warning", "danger", "info"
      message: ''
    }
  },
  serverMessage: ''
};

export default function accountingSubject(state = initState, action) {
  switch (action.type) {

    // 添加错误提示stack
    case ERROR_MESSAGES_UPDATE:
      return update(state, {
        errorMessages: {
          push: [action.message]
        }
      });

    // 页面上的消息框
    case SHOW_ADMIN_ALERT:
      return update(state, {
        adminAlert: {
          show: {$set: true}
        }
      });
    case HIDE_ADMIN_ALERT:
      return update(state, {
        adminAlert: {
          show: {$set: false}
        }
      });

    // 对话框中的消息框
    case FORM_ALERT_OPEN:
      return update(state, {
        formAlert: {
          show: {$set: true}
        }
      });
    case FORM_ALERT_CLOSE:
      return update(state, {
        formAlert: {
          show: {$set: false}
        }
      });

    // 获取表格体数据
    case LOAD_TABLEDATA:
      return {...state,
        loading: true
      };
    case LOAD_TABLEDATA_SUCCESS:
      return {...state,
        loading: false,
        loaded: true,
        tableData: action.data.items,
        totalDataCount: action.data.totalCount,
        totalPage: action.data.totalPage
      };
    case LOAD_TABLEDATA_FAIL:
      return {...state,
        loading: false,
        loaded: false,
        tableData: [],
        adminAlert: {...state.adminAlert,
          show: true,
          bsStyle: 'danger',
          message: action.message,
          resBody: action.resBody
        }
      };

    // 获取表格头数据
    case LOAD_TABLECOLUMNS:
      return {...state,
        adminAlert: {
          show: false
        }
      };
    case LOAD_TABLECOLUMNS_SUCCESS:
      return {...state,
        fields: action.data.fields,
      };
    case LOAD_TABLECOLUMNS_FAIL:
      return {...state,
        fields: [],
        adminAlert: {...state.adminAlert,
          show: true,
          bsStyle: 'danger',
          message: action.message,
          resBody: action.details
        }
      };

    // 获取会计平台子科目的字段
    case LOAD_CHILDSUBJECTFIELDS:
      return {...state,
        adminAlert: {
          show: false
        }
      };
    case LOAD_CHILDSUBJECTFIELDS_SUCCESS:
      return {...state,
        childSubjectFields: action.data.fields,
      };
    case LOAD_CHILDSUBJECTFIELDS_FAIL:
      return {...state,
        childSubjectFields: [],
        adminAlert: {...state.adminAlert,
          show: true,
          bsStyle: 'danger',
          message: action.message,
          resBody: action.details
        }
      };

    case DELETE_TABLEDATA_FAIL:
      return {...state,
        adminAlert: {...state.adminAlert,
          show: true,
          bsStyle: 'danger',
          message: action.message
        }
      };


    // 通过表单修改表格中的一行
    case TABLEDATA_UPDATE_SUCCESS:
      return update(state, {
        tableData: {
          [action.data.rowIdx]: {$set: action.data.rowData}
        },
        createDialog: {
          show: {$set: false}
        },
        editDialog: {
          show: {$set: false}
        },
        // FICLOUD-200
        // adminAlert: {
        //   show: {$set: true},
        //   bsStyle: {$set: 'success'},
        //   message: {$set: '保存成功'}
        // }
      });
    case TABLEDATA_UPDATE_FAILURE:
      return update(state, {
        formAlert: {
          $set: {
            show: true,
            bsStyle: 'danger',
            message: action.message,
            resBody: action.resBody
          }
        },
        serverMessage: {
          $set: action.resBody
        }
      });

    // 删除表格中的一行
    case DELETE_TABLEDATA_SUCCESS:
      return update(state, {
        adminAlert: {
          show: {$set: true},
          bsStyle: {$set: 'success'},
          message: {$set: '删除成功'}
        }
      });

    case CHANGE_SELECTED_ROWS:
      return {...state,
        selectedRows: action.selectedRows
      }

    // 对话框

    case SHOW_EDIT_DIALOG:
    case EDIT_DIALOG_CLOSE:
      return update(state, {
        editDialog: {
          $set: {
            show: action.openDialog,
            formData: action.formData,
            rowIdx: action.rowIdx
          }
        },
        formAlert: {
          show: {$set: false}
        },
        editFormData: {$set: action.formData},
        serverMessage: {$set: ''}
      });
    case UPDATE_EDIT_FORM_FIELD_VALUE:
      // Update single value inside specific array item
      // http://stackoverflow.com/questions/35628774/how-to-update-single-value-inside-specific-array-item-in-redux
      return update(state, {
        editFormData: {
          [action.id]: {
            $set: action.payload
          }
        }
      });
    case ARCH_INIT_EDIT_FORM_DATA:
      return {...state,
        editFormData: action.editFormData
      }
    case SUBMIT_EDIT_FORM:
      return {...state,
        submitting: true
      };
    case SUBMIT_EDIT_FORM_SUCCESS:
      return {...state,
        submitting: false,
        submited: true,
        adminAlert: {...state.adminAlert,
          show: true,
          bsStyle: action.bsStyle,
          message: action.message
        }
      };
    case SUBMIT_EDIT_FORM_FAIL:
      return {...state,
        submitting: false,
        submitted: false,
        adminAlert: {...state.adminAlert,
          show: true,
          bsStyle: action.bsStyle,
          message: action.message
        }
      };

    // child dialog
    case SHOW_CHILD_DIALOG:
    case CHILD_DIALOG_CLOSE:
      return update(state, {
        childDialog: {
          $set: {
            show: action.openDialog,
            formData: action.formData,
            rowIdx: action.rowIdx
          }
        },
        formAlert: {
          show: {$set: false}
        },
        childFormData: {$set: action.formData},
        serverMessage: {$set: ''}
      });
    case UPDATE_CHILD_FORM_FIELD_VALUE:
      // Update single value inside specific array item
      // http://stackoverflow.com/questions/35628774/how-to-update-single-value-inside-specific-array-item-in-redux
      return update(state, {
        childFormData: {
          [action.id]: {
            $set: action.payload
          }
        }
      });
    case ARCH_INIT_CHILD_FORM_DATA:
      return {...state,
        childFormData: action.childFormData
      }
    case SUBMIT_CHILD_FORM:
      return {...state,
        submitting: true
      };
    case SUBMIT_CHILD_FORM_SUCCESS:
      return {...state,
        submitting: false,
        submited: true,
        adminAlert: {...state.adminAlert,
          show: true,
          bsStyle: action.bsStyle,
          message: action.message
        }
      };
    case SUBMIT_CHILD_FORM_FAIL:
      return {...state,
        submitting: false,
        submitted: false,
        adminAlert: {...state.adminAlert,
          show: true,
          bsStyle: action.bsStyle,
          message: action.message
        }
      };

    // create dialog
    case SHOW_CREATE_DIALOG:
    case HIDE_CREATE_DIALOG:
      return {...state,
        createDialog: {
          show: action.openDialog,
          formData: action.formData
        },
        createFormData: action.formData,
        serverMessage: ''
      };
    case UPDATE_CREATE_FORM_FIELD_VALUE:
      // Update single value inside specific array item
      // http://stackoverflow.com/questions/35628774/how-to-update-single-value-inside-specific-array-item-in-redux
      return update(state, {
        createFormData: {
          [action.id]: {
            value: {$set: action.payload}
          }
        }
      });
    case INIT_CREATE_FORM_DATA:
      return {...state,
        createFormData: action.formData
      }
    case SUBMIT_CREATE_FORM:
      return {...state,
        submitting: true
      };
    case SUBMIT_CREATE_FORM_SUCCESS:
      return {...state,
        submitting: false,
        submited: true,
        adminAlert: {...state.adminAlert,
          show: true,
          bsStyle: action.bsStyle,
          message: action.message
        }
      };
    case SUBMIT_CREATE_FORM_FAIL:
      return {...state,
        submitting: false,
        submitted: false,
        adminAlert: {...state.adminAlert,
          show: true,
          bsStyle: action.bsStyle,
          message: action.message
        }
      };

    case GOTO_PAGE:
      return {...state,
        startIndex: action.startIndex,
        activePage: action.nextPage
      };

    case REFER_FIELDS_UPDATE:
      return update(state, {
        fields: {
          [action.fieldIndex]: {
            referConfig: {
              referConditions: {
                filterNotContainCondition: { $set : action.code }
              }
            }
          }
        }
      });

    default:
      return state;
  }
}
