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
import { Grid as SSCGrid } from 'ssc-grid';

import AdminAlert from '../components/AdminAlert';
import MessageConfirm from '../components/MessageConfirm';
import * as Actions from '../actions/mappingDef';

const BASE_DOC_ID = 'mappingdef';

/**
 * 会计平台 - 转换规则定义
 * 后端接口文档：http://git.yonyou.com/sscplatform/fc_doc/blob/master/exchanger/mapdef.md
 */

class MappingDef extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
      startIndex: 0
    };
    // This binding is necessary to make `this` work in the callback
    this.handlePageAlertDismiss = this.handlePageAlertDismiss.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
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
    this.context.router.push('/mapping-def2/create');
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
        container.refs.messageConfirm.initParam(param);
      },
      render() {
        const {
          rowObj: { id }
        } = this.props;
        const desBillType = this.props.rowObj.des_billtype;
        return (
          <td>
            <span tabIndex="0" role="button" onClick={this.handleRemove}>删除</span>
            <Link to={`/mapping-def2/${id}`}>
              修改
            </Link>
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

    return (
      <div className="mapping-def-container content">
        <MessageConfirm ref={(c) => { this.messageConfirm = c; }} />
        <AdminAlert
          show={pageAlert.show}
          bsStyle={pageAlert.bsStyle}
          onDismiss={this.handlePageAlertDismiss}
        >
          <p>{pageAlert.message}</p>
        </AdminAlert>
        <div className="head" style={{ textAlign: 'right' }}>
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
      </div>
    );
  }
}

MappingDef.contextTypes = {
  router: PropTypes.object.isRequired
};

MappingDef.propTypes = {
  createTableBodyDataAndFetchTableBodyData: PropTypes.func.isRequired,
  fetchTableBodyData: PropTypes.func.isRequired,
  fetchTableColumnsModel: PropTypes.func.isRequired,
  // store
  itemsPerPage: PropTypes.number.isRequired,
  pageAlert: PropTypes.shape({
    show: PropTypes.bool.isRequired,
    bsStyle: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired
  }).isRequired,
  startIndex: PropTypes.number.isRequired,
  tableBodyData: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired
  })).isRequired,
  tableColumnsModel: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired
  })).isRequired,
  totalPage: PropTypes.number.isRequired,
  // actions
  showCreateDialog: PropTypes.func.isRequired,
  showEditDialog: PropTypes.func.isRequired,
  showPageAlert: PropTypes.func.isRequired,
  updateTableBodyDataAndFetchTableBodyData: PropTypes.func.isRequired,
};

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
