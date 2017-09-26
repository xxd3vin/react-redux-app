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

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import { Grid as SSCGrid, Form } from 'ssc-grid';
import Formula from 'ssc-formula';
import { Refers } from 'ssc-refer';

// 后端接口URL
import * as URL from '../constants/URLs';
import { fieldModelShape, tableRowShape } from './PropTypes';
import * as Actions from '../actions/entityMap';

import AdminEditDialog from '../components/AdminEditDialog';
import AdminAlert from '../components/AdminAlert';
// import FormulaField from '../components/FormulaField';

class EntityMapTable extends Component {
  static displayName = 'EntityMapTable'
  static propTypes = {
    addTreeNodeDataAndFetchTreeNodeData: PropTypes.func.isRequired,
    cleanPageState: PropTypes.func.isRequired,
    createDialog: PropTypes.object.isRequired,
    editDialog: PropTypes.object.isRequired,
    editFormData: PropTypes.object.isRequired,
    entityFieldsModel: PropTypes.arrayOf(fieldModelShape).isRequired,
    entityTableBodyData: PropTypes.arrayOf(tableRowShape).isRequired,
    pageAlert: PropTypes.object.isRequired,
    serverMessage: PropTypes.string.isRequired,
    showCreateDialog: PropTypes.func.isRequired,
    showEditDialog: PropTypes.func.isRequired,
    showFormAlert: PropTypes.func.isRequired,
    showPageAlert: PropTypes.func.isRequired,
    updateTreeNodeDataAndFetchTreeNodeData: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.handleCreateFormChange = this.handleCreateFormChange.bind(this);
    this.state = {};
  }

  componentWillMount() {
    this.props.cleanPageState();
  }

  componentDidMount() {
  }

  /**
   * @param {Object} nextProps
   */
  componentWillReceiveProps() {
  }

  closeEditDialog() {
    this.props.showEditDialog(false);
  }

  closeCreateDialog() {
    this.props.showCreateDialog(false, {});
  }

  handleCreateFormChange(fieldId, value) {
    if (fieldId === 'src_entityid') {
      this.setState({
        src_entityid: value[0].id
      });
    }
  }
  /**
   * formData
   * 如果是refer
   * ```
   * {
   *   pk_org: {
   *     selected: [{
   *       id: '',
   *       code: '',
   *       name: ''
   *     }]
   *   }
   * }
   * ```
   */
  handleCreateFormSubmit(formData) {
    this.props.entityFieldsModel.forEach((fieldModel) => {
      switch (fieldModel.datatype) {
        case 5:
          if (formData[fieldModel.id] && formData[fieldModel.id].length === 1) {
            formData[fieldModel.id] = formData[fieldModel.id][0];
          }
          break;
        default:
          break;
      }
    });
    // 手动加两个字段
    const { infoKey, key } = this.props.clickedTreeNodeData;
    formData.des_entityid = key.split(':')[1];
    formData.mappingdefid = infoKey;
    this.props.addTreeNodeDataAndFetchTreeNodeData(formData);
  }
  handleCreateFormReset(/* event*/) {
    this.props.showCreateDialog(false, {});
    // event.preventDefault();
  }

  // edit form
  handleEditFormSubmit(formData) {
    this.props.entityFieldsModel.forEach((fieldModel) => {
      switch (fieldModel.datatype) {
        case 5:
          if (formData[fieldModel.id] && formData[fieldModel.id].length === 1) {
            formData[fieldModel.id] = formData[fieldModel.id][0];
          }
          break;
        default:
          break;
      }
    });
    // 手动加两个字段
    const { infoKey, key } = this.props.clickedTreeNodeData;
    formData.des_entityid = key.split(':')[1];
    formData.mappingdefid = infoKey;
    this.props.updateTreeNodeDataAndFetchTreeNodeData(formData);
  }
  handleEditFormReset(/* event*/) {
    this.props.showEditDialog(false, null, {});
    // event.preventDefault();
  }

  handlePageAlertDismiss() {
    this.props.showPageAlert(false, '');
  }

  handleFormAlertDismiss() {
    this.props.showFormAlert(false, '');
  }

  getCustomComponent() {
    let container = this;
    return React.createClass({
      handleEdit(/* event*/) {
        const { rowIdx, rowObj } = this.props;
        // 显示编辑对话框并填充表单
        container.props.showEditDialog(true, rowIdx, rowObj);
      },
      handleRemove(/* event*/) {
        if (!confirm('是否删除？')) {
          return;
        }
        const { rowIdx, rowObj } = this.props;
        const { startIndex } = container.props;
        container.props.delTreeNodeDataAndFetchTreeNodeData(rowObj);
      },
      render() {
        return (
          <td>
            <span
              onClick={this.handleEdit}
              className="" title="修改"
            >修改</span>
            <span
              onClick={this.handleRemove}
              className="" title="删除"
            >删除</span>
          </td>
        );
      }
    });
  }

  /**
   * 根据列模型和表格体数据来构建空表单需要的数据
   * 以参照来举例，需要现从columnsModel中的type来现确认哪个字段是参照，然后从
   * tableData中获取参照的具体信息，一般是：
   * ```json
   * { id: '', code: '', name: '' }
   * ```
   */
  getFormDefaultData(columnsModel) {
    let formData = {};
    columnsModel.forEach((fieldModel) => {
      // 隐藏字段，比如id字段，不用初始化值
      if (fieldModel.hidden === true) {
        return;
      }
      const fieldId = fieldModel.id;
      switch (fieldModel.datatype) {
        case 5:
          formData[fieldId] = [{
            id: '',
            code: '',
            name: ''
          }];
          break;
        case 4:
          // XXDEBUG-START
          // “启用”字段默认应该是true，后端没有传递这个信息，所以只好在前端写死
          if (fieldId === 'enable') {
            formData[fieldId] = true;
          }
          // XXDEBUG-END
          break;
        default:
          formData[fieldId] = '';
          break;
      }
    });
    return formData;
  }

  getFormulaField(refCode, entityId) {
    return React.createClass({
      getInitialState() {
        return {
          value: this.props.customFieldValue
        };
      },
      handleChange(event) {
        let value = event.target.value;
        this.setState({ value });
        if (this.props.onCustomFieldChange) {
          this.props.onCustomFieldChange(value);
        }
      },
      handleClick() {
        this.formula.showAlert();
      },
      /**
       * 公式编辑器点击完成
       */
      handleDataBack(data) {
        this.setState({ value: data });
        if (this.props.onCustomFieldChange) {
          this.props.onCustomFieldChange(data);
        }
      },
      render() {
        return (
          <div>
            <input
              value={this.state.value}
              onChange={this.handleChange}
              onClick={this.handleClick}
            />
            <Formula
              config={{
                workechart: {
                  metatree: URL.FormulaURL
                },
                refer: {
                  referDataUrl: URL.ReferDataURL,
                  referDataUserUrl: URL.ReferUserDataURL
                }
              }}
              formulaText={this.state.value}
              ref={(ref) => { this.formula = ref; }}
              // source entity id 源实体
              eid={entityId}
              // 参照 refinfocode/refCode
              refItem={refCode}
              backFormula={this.handleDataBack}
            />
          </div>
        );
      }
    });
  }

  getReferField(refCode) {
    // 封装一个参照组件作为自定义组件
    return React.createClass({
      propTypes: {
        /**
         * Form表单组件传入的值
         * ```js
         * [{
         *   id: 'G001ZM0000BASEDOCDEFAULTORG000000000',
         *   code: '0001',
         *   name: '默认组织'
         * }]
         * ```
         */
        customFieldValue: React.PropTypes.array,
        /**
         * 自定义类型字段发生变化的时候
         * @param {Object} value 参照值，比如
         * ```js
         * [{
         *   id: 'G001ZM0000BASEDOCDEFAULTORG000000000',
         *   code: '0001',
         *   name: '默认组织'
         * }]
         * ```
         */
        onCustomFieldChange: React.PropTypes.func
      },
      getDefaultProps() {
        return {
        };
      },
      getInitialState() {
        return {
        };
      },
      handleChange(selected) {
        // alert(JSON.stringify(selected));
        if (this.props.onCustomFieldChange) {
          this.props.onCustomFieldChange(selected);
        }
      },
      render() {
        const referConditions = {
          refCode,
          refType: 'tree',
          // 赵老师说：参照出不来name的问题，我这边改了下，在请求中加个参数 ，
          // 如下实例 "convertcol":"{name:displayName}"，标示将数据库中的
          // displayName字段对照到name，这样，就可以了
          convertcol: '{name:displayName}',
          rootName: '部门'
        };
        // URL.ReferUserDataURL
        return (
          <Refers
            disabled={false}
            minLength={0}
            align="justify"
            emptyLabel=""
            labelKey="name"
            onChange={this.handleChange}
            placeholder="请选择..."
            referConditions={referConditions}
            referDataUrl={URL.ReferDataURL}
            referType="list"
            defaultSelected={this.props.customFieldValue}
            ref={(ref) => { this.myrefers = ref; }}
          />
        );
      }
    });
  }

  render() {
    const {
      entityFieldsModel,
      entityTableBodyData,
      editDialog,
      editFormData,
      createDialog,
      pageAlert
    } = this.props;

    let entityFieldsModel2 = entityFieldsModel
      // 准备制作自定义组件 - 公式编辑器
      .map(({ ...fieldModel }) => {
        if (fieldModel.datatype === 20 && fieldModel.type === 'custom') {
          if (!_.isEmpty(editFormData)) {
            fieldModel.component = this.getFormulaField(
              fieldModel.refinfocode,
              editFormData.src_entityid.id
            );
          } else {
            // TODO 当创建窗口弹出的时候，需要用户先点击选择“源实体”，然后从选择结果中取出
            // id，作为getFormulaField的第二个参数。
            let srcEntityid = {
              id: this.state.src_entityid
            };
            fieldModel.component = this.getFormulaField(
              fieldModel.refinfocode,
              srcEntityid.id
            );
          }
        }
        return fieldModel;
      })
      // 参照型的初始化
      .map(({ ...fieldModel }) => {
        if (fieldModel.datatype === 5 && fieldModel.type === 'custom') {
          // 表单的自定义组件
          fieldModel.component = this.getReferField(fieldModel.refinfocode);
          // 初始化编辑表单的值
          if (!_.isEmpty(editFormData)) {
            editFormData[fieldModel.id] = [editFormData[fieldModel.id]];
          }
          // 表格单元格的格式化
          fieldModel.formatter = {
            type: 'custom',
            callback: value => (value ? value.name : '')
          };
        }
        return fieldModel;
      });

    // 点击添加按钮时候，表单应该是空的，这里创建表单需要的空数据
    const formDefaultData = this.getFormDefaultData(entityFieldsModel2);

    return (
      <div>
        <AdminAlert
          show={pageAlert.show}
          bsStyle={pageAlert.bsStyle}
          onDismiss={::this.handlePageAlertDismiss}
        >
          <p>{pageAlert.message}</p>
        </AdminAlert>
        <SSCGrid
          columnsModel={entityFieldsModel2}
          tableData={entityTableBodyData}
          className="ssc-grid"
          operationColumn={{}}
          operationColumnClass={this.getCustomComponent()}
        />
        <AdminEditDialog
          className="edit-form"
          title="修改"
          show={editDialog.show}
          onHide={::this.closeEditDialog}
        >
          <p className="server-message" style={{ color: 'red' }}>
            {this.props.serverMessage}
          </p>
          <Form
            fieldsModel={entityFieldsModel2}
            defaultData={editFormData}
            onSubmit={::this.handleEditFormSubmit}
            onReset={::this.handleEditFormReset}
          />
        </AdminEditDialog>
        <AdminEditDialog
          className="create-form"
          title="新增"
          show={createDialog.show}
          onHide={::this.closeCreateDialog}
        >
          <p className="server-message" style={{ color: 'red' }}>
            {this.props.serverMessage}
          </p>
          <Form
            fieldsModel={entityFieldsModel2}
            defaultData={formDefaultData}
            onSubmit={::this.handleCreateFormSubmit}
            onChange={this.handleCreateFormChange}
            onReset={::this.handleCreateFormReset}
          />
        </AdminEditDialog>
      </div>
    );
  }
}

/**
 * @param {Object} state
 * @param {Object} ownProps
 */
const mapStateToProps = state => ({ ...state.entityMap });

const mapDispatchToProps = dispatch => bindActionCreators(Actions, dispatch);

// The component will subscribe to Redux store updates.
export default connect(mapStateToProps, mapDispatchToProps)(EntityMapTable);
