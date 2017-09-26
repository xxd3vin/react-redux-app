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
 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { Button } from 'react-bootstrap';
import { Grid as SSCGrid, Form as SSCForm } from 'ssc-grid';

import { fieldModelShape, tableRowShape } from './PropTypes';
import * as Actions from '../actions/mappingDef';

import AdminDialog from '../components/AdminEditDialog';
import AdminAlert from '../components/AdminAlert';
import FormulaField from '../components/FormulaField';
import MessageConfirm from '../components/MessageConfirm';

const BASE_DOC_ID = 'mappingdef';

/**
 * 会计平台 - 转换规则定义
 * 后端接口文档：http://git.yonyou.com/sscplatform/fc_doc/blob/master/exchanger/mapdef.md
 */

class MappingDef extends Component {
  static displayName = 'MappingDef'
  static propTypes = {
    createDialog: PropTypes.object.isRequired,
    createTableBodyDataAndFetchTableBodyData: PropTypes.func.isRequired,
    editDialog: PropTypes.object.isRequired,
    editFormData: PropTypes.object.isRequired,
    fetchTableBodyData: PropTypes.func.isRequired,
    fetchTableColumnsModel: PropTypes.func.isRequired,
    itemsPerPage: PropTypes.number,
    pageAlert: PropTypes.object.isRequired,
    serverMessage: PropTypes.string.isRequired,
    showCreateDialog: PropTypes.func.isRequired,
    showEditDialog: PropTypes.func.isRequired,
    showPageAlert: PropTypes.func.isRequired,
    startIndex: PropTypes.number.isRequired,
    tableBodyData: PropTypes.arrayOf(tableRowShape).isRequired,
    tableColumnsModel: PropTypes.arrayOf(fieldModelShape).isRequired,
    totalPage: PropTypes.number.isRequired,
    updateTableBodyDataAndFetchTableBodyData: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.handleCreate = this.handleCreate.bind(this);
    this.state = {
      activePage: 1,
      startIndex: 0
    };
    this.handlePageAlertDismiss = this.handlePageAlertDismiss.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
    this.closeCreateDialog = this.closeCreateDialog.bind(this);
    this.handleCreateFormSubmit = this.handleCreateFormSubmit.bind(this);
    this.closeEditDialog = this.closeEditDialog.bind(this);
    this.handleEditFormSubmit = this.handleEditFormSubmit.bind(this);
  }

  componentWillMount() {
    const { itemsPerPage, startIndex } = this.props;
    this.props.fetchTableColumnsModel(BASE_DOC_ID);
    this.props.fetchTableBodyData(itemsPerPage, startIndex);
  }

  componentDidMount() {
    document.title = '转换规则定义';
  }

  componentWillReceiveProps(/* nextProps */) {
  }

  /**
   * 错误提示框
   */

  handlePageAlertDismiss() {
    this.props.showPageAlert(false);
  }

  /**
   * “”创建”按钮
   */

  // 点击“创建”按钮
  handleCreate(/* event */) {
    const { tableBodyData } = this.props;
    const rowData = tableBodyData[0];
    this.props.showCreateDialog(true, rowData);
    // event.preventDefault();
  }

  /**
   * 表格
   */

  // http://git.yonyou.com/sscplatform/ssc_web/commit/767e39de04b1182d8ba6ad55636e959a04b99d2b#note_3528
  // handlePagination(event, selectedEvent) {
  handlePagination(eventKey) {
    const { itemsPerPage } = this.props;
    let nextPage = eventKey;
    let startIndex = (nextPage - 1) * itemsPerPage;

    this.props.fetchTableBodyData(itemsPerPage, startIndex);

    this.setState({
      activePage: nextPage,
      startIndex
    });
  }

  /**
   * 创建对话框
   */

  closeCreateDialog() {
    this.props.showCreateDialog(false);
  }
  handleCreateFormSubmit(formData) {
    this.props.createTableBodyDataAndFetchTableBodyData(formData);
  }

  /**
   * 编辑对话框
   */

  closeEditDialog() {
    this.props.showEditDialog(false);
  }
  handleEditFormSubmit(formData) {
    this.props.updateTableBodyDataAndFetchTableBodyData(formData);
  }

  getCustomComponent() {
    const container = this;
    return React.createClass({
      propTypes: {
        rowIdx: PropTypes.number.isRequired,
        rowObj: PropTypes.shape({
          id: PropTypes.string.isRequired,
          des_billtype: PropTypes.shape({
            id: PropTypes.string.isRequired
          }).isRequired
        }).isRequired
      },
      handleEdit(/* event */) {
        const { rowIdx, rowObj } = this.props;
        // 将rowData保存到store中
        container.props.showEditDialog(true, rowIdx, rowObj);
      },
      handleRemove(/* event */) {
        const { rowObj } = this.props;
        let param = {
          isShow: true,
          txt: '是否删除？',
          sureFn: () => {
            container.props.deleteTableBodyDataAndFetchTableBodyData(rowObj);
          }
        };
        container.messageConfirm.initParam(param);
      },
      render() {
        const {
          rowObj: { id }
        } = this.props;
        const desBillType = this.props.rowObj.des_billtype;
        return (
          <td>
            <span onClick={this.handleRemove}>删除</span>
            <span onClick={this.handleEdit}>修改</span>
            {
              typeof desBillType === 'object' && desBillType !== null
              ? <Link to={`/entity-map-no-sidebar-single-page/${desBillType.id}/${id}`}>
                  子表
                </Link>
              : null
            }
          </td>
        );
      }
    });
  }

  render() {
    const {
      itemsPerPage, tableColumnsModel, tableBodyData, pageAlert
    } = this.props;

    // 准备制作自定义组件 - 公式编辑器
    const tableColumnsModel2 = tableColumnsModel.map(({ ...columnModel }) => {
      if (columnModel.datatype === 20 && columnModel.type === 'custom') {
        columnModel.component = FormulaField;
      }
      return columnModel;
    });

    return (
      <div className="mapping-def-container content">
        <MessageConfirm ref={(c) => { this.messageConfirm = c; }} />
        <div className="header">
          <div className="header-title">
            <span>平台接入配置</span>
          </div>
        </div>
        <AdminAlert
          show={pageAlert.show}
          bsStyle={pageAlert.bsStyle}
          onDismiss={this.handlePageAlertDismiss}
        >
          <p>{pageAlert.message}</p>
        </AdminAlert>
        <div className="head text-right">
          <Button onClick={this.handleCreate}>新增</Button>
        </div>
        <div>
          <SSCGrid
            className="ssc-grid"
            columnsModel={tableColumnsModel}
            tableData={tableBodyData}
            // 分页
            paging
            itemsPerPage={itemsPerPage}
            totalPage={this.props.totalPage}
            activePage={this.state.activePage}
            onPagination={this.handlePagination}
            operationColumn={{
              className: 'col-120',
              text: '操作'
            }}
            operationColumnClass={this.getCustomComponent()}
          />
        </div>
        <AdminDialog
          className="create-form"
          title="新增"
          show={this.props.createDialog.show}
          onHide={this.closeCreateDialog}
        >
          <p className="server-message" style={{ color: 'red' }}>
            {this.props.serverMessage}
          </p>
          <SSCForm
            fieldsModel={tableColumnsModel}
            defaultData={this.state.createFormData}
            onSubmit={this.handleCreateFormSubmit}
            onReset={this.closeCreateDialog}
          />
        </AdminDialog>
        <AdminDialog
          className="edit-form"
          title="修改"
          show={this.props.editDialog.show}
          onHide={this.closeEditDialog}
        >
          <p className="server-message" style={{ color: 'red' }}>
            {this.props.serverMessage}
          </p>
          <SSCForm
            fieldsModel={tableColumnsModel2}
            defaultData={this.props.editFormData}
            onSubmit={this.handleEditFormSubmit}
            onReset={this.closeEditDialog}
          />
        </AdminDialog>
      </div>
    );
  }
}

/**
 * @param {Object} state
 * @param {Object} ownProps
 */
const mapStateToProps = state => ({ ...state.mappingDef });

/**
 * @param {Function} dispatch
 */
const mapDispatchToProps = dispatch => bindActionCreators(Actions, dispatch);

// The component will subscribe to Redux store updates.
export default connect(mapStateToProps, mapDispatchToProps)(MappingDef);
