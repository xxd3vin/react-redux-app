import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { Grid, Row, Col, Button, Modal } from 'react-bootstrap';
import { Table } from 'react-bootstrap';

import { Grid as SSCGrid, Form, Tree as SSCTree } from 'ssc-grid';

import NormalWidget from '../components/NormalWidget';
import AdminEditDialog from '../components/AdminEditDialog';
import AdminAlert from '../components/AdminAlert';

import * as Actions from '../actions/externalDataModelling';

// Consants for table and form
const ItemsPerPage = 15;
const ReferDataURL = 'http://10.3.14.239/ficloud/refbase_ctr/queryRefJSON';

class ExternalDataModelling extends Component {
  static propTypes = {
    /**
     * 左侧树的数据
     */
    outerEntityTree: PropTypes.array.isRequired
  }

  state = {
    activePage: 1,
    startIndex: 0
  }

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.fetchOuterEntityTree(this.props.params.billTypeCode);
  }

  componentWillReceiveProps(nextProps) {
    const nextType = nextProps.params.baseDocId;
    const currentType = this.props.params.baseDocId;
    // 当跳转到其他类型的基础档案时候，重新加载表格数据
    if (nextType !== currentType) {
      this.props.fetchTableBodyData(nextType, ItemsPerPage, this.state.startIndex);
      this.props.fetchTableColumnsModel(nextType);
    }
  }

  // admin card actions
  handleCreate(event) {
    const { tableData } = this.props;
    const rowData = tableData[0];
    this.props.showCreateDialog(rowData);
  }

  closeEditDialog() {
    this.props.closeEditDialog();
  }

  closeCreateDialog() {
    this.props.hideCreateDialog();
  }

  // create form
  handleCreateFormBlur(label, value) {
    //this.props.updateCreateFormFieldValue(label, value);
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
  handleCreateFormSubmit(event, formData) {
    const { startIndex } = this.state;
    const { fields, params: { baseDocId } } = this.props;
    //this.props.submitCreateForm();
    this.props.saveTableData(baseDocId, fields, formData);
    this.props.fetchTableBodyData(baseDocId, ItemsPerPage, startIndex);
    event.preventDefault();
  }
  handleCreateFormReset(event) {
    this.props.hideCreateDialog();
    event.preventDefault();
  }

  // edit form
  handleEditFormBlur(index, fieldModel, value) {
    //this.props.updateEditFormFieldValue(index, fieldModel, value);
  }
  handleEditFormReset(event) {
    this.props.closeEditDialog();
    event.preventDefault();
  }

  handlePageAlertDismiss(){
    this.props.hideAdminAlert();
  }

  handleFormAlertDismiss(){
    this.props.hideAdminAlert();
  }

  // http://git.yonyou.com/sscplatform/ssc_web/commit/767e39de04b1182d8ba6ad55636e959a04b99d2b#note_3528
  //handlePagination(event, selectedEvent) {
  handlePagination(eventKey) {
    const { tableData } = this.props;
    let nextPage = eventKey;
    let startIndex = (nextPage-1) * ItemsPerPage;

    this.props.fetchTableBodyData(this.props.params.baseDocId, ItemsPerPage, startIndex);

    this.setState({
      activePage: nextPage,
      startIndex
    });
  }

  getCustomComponent() {
    var containerThis = this;
    return React.createClass({
      handleEdit(event) {
        const { rowIdx, rowObj } = this.props;
        // 将rowData保存到store中
        containerThis.props.showEditDialog(rowIdx, rowObj);
        // 从store中取出editFormData填充到表单上
        containerThis.props.initEditFormData(rowObj);
      },
      handleRemove(event) {
        if (!confirm("是否删除？")) {
          return;
        }
        const { rowIdx, rowObj } = this.props;
        const { startIndex } = containerThis.state;
        const { baseDocId } = containerThis.props.params;
        containerThis.props.deleteTableData(baseDocId, rowIdx, rowObj);
        containerThis.props.fetchTableBodyData(baseDocId, ItemsPerPage, startIndex);
      },
      render() {
        return (
          <td>
            <span onClick={this.handleEdit}
              className="glyphicon glyphicon-pencil"></span>
            <span onClick={this.handleRemove}
              className="glyphicon glyphicon-trash"></span>
          </td>
        );
      }
    });
  }

  getReferConfig(fieldRefCode) {
    return {
      referConditions: {
        refCode: fieldRefCode, // 'dept', 该参照类型的字段指向的档案类型
        refType: 'tree',
        rootName: '部门'
      },
      referDataUrl: ReferDataURL
    };
  }

  /**
   * 根据列模型和表格体数据来构建空表单需要的数据
   * 以参照来举例，需要现从columnsModel中的type来现确认哪个字段是参照，然后从
   * tableData中获取参照的具体信息，一般是：
   * ```json
   * { id: '', code: '', name: '' }
   * ```
   */
  getFormDefaultData(columnsModel, tableData, baseDocId) {
    let formData = {};
    columnsModel.forEach(fieldModel => {
      const fieldId = fieldModel.id;
      switch(fieldModel.type) {
        case 'ref':
          formData[fieldId] = {
            id: '',
            code: '',
            name: ''
          };
          break;
        case 'boolean':
          break;
        default:
          formData[fieldId] = '';
          break;
      }
    });
    return formData;
  }

  /**
   * 往formData上的参照字段添加参照的配置
   */
  initReferConfig(formData, columnsModel, tableData, baseDocId) {
    columnsModel.forEach(fieldModel => {
      const fieldId = fieldModel.id;
      if (fieldModel.type !== 'ref' || !tableData[0]) {
        return;
      }
      // 后端返回的数据可能为null
      if (formData[fieldId] == null) {
        return;
      }
      formData[fieldId].config = { ...this.getReferConfig(fieldModel.refCode) };
    });
    return formData;
  }

  handleChange(fieldId, value) {
    const newState = { ...this.state };
    newState.formData[fieldId] = value;
    this.setState(newState);
  }

  handleSubmit(formData) {
    alert('提交的数据: Form.state.formData: \n' + JSON.stringify(
      formData,
      null, '  '));
  }


  render() {
    const { outerEntityTree } = this.props;

    const properties = [
      {label: '显示名称', value: '家庭地址'},
      {label: '外部系统定义的表标签', value: ''}
    ];

const mockFieldsModel = [
  {type: 'string', id: 'id', label: '主键', hidden: true},
  {type: 'string', id: 'danjubianhao', label: '单据编号'},
  {type: 'string', id: 'name2', label: '名称2', hidden: true},
  {type: 'string', id: 'name3', label: '名称3', hidden: true},
  {type: 'string', id: 'name4', label: '名称4', hidden: true},
  {type: 'enum', id: 'danjuleixing', label: '单据类型', placeholder: '请选择单据类型',
    data: [
      {key: '2631', value: '差旅费借款单'},
      {key: '2632', value: '会议费借款单'},
      {key: 'D3', value: '付款单'}
    ]
  },
  {type: 'double', id: 'jine', label: '金额'},
  {type: 'date', id: 'danjuriqi', label: '单据日期'},
  {type: 'boolean', id: 'qiyong', label: '启用'}
];

const mockFormData = {
  id: '22EA0EB9-FABA-4224-B290-4D041A1DF773',
  danjubianhao: 'abc123',
  name2: '名称2',
  name3: '名称3',
  name4: '名称4',
  danjuleixing: 'D3',
  jine: '12.00',
  danjuriqi: new Date('2017-02-14').toISOString(),
  qiyong: false
};



    return (
      <div className="external-data-modelling-container">
        <Grid>
          <Row>
            <Col md={4}>
            {
              outerEntityTree.length === 0
              ? null
              : <SSCTree
                  className="left-tree"
                  showLine
                  checkable
                  defaultExpandAll
                  treeData={outerEntityTree}
                />
            }
            </Col>
            <Col md={8}>
              <h3>属性编辑器</h3>
              <Form
                fieldsModel={mockFieldsModel}
                defaultData={mockFormData}
                onChange={::this.handleChange}
                onSubmit={::this.handleSubmit}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {...state.externalDataModelling};
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch);
}

// The component will subscribe to Redux store updates.
export default connect(mapStateToProps, mapDispatchToProps)(ExternalDataModelling);
