import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Button, Checkbox } from 'react-bootstrap';

import Table from './Table';
import BaseDocCreateForm from './BaseDocCreateForm';
import BaseDocEditForm from './BaseDocEditForm';

import AdminEditDialog from '../../components/AdminEditDialog';
import AdminAlert from '../../components/AdminAlert';
import Spinner from '../../components/spinner/spinner';
import MessageTips from '../../components/MessageTips';

import * as Actions from '../../actions/table';
import getBaseDocTypes from '../../constants/BaseDocTypes';

const baseDocId = 'dept';

class TableContainer extends Component {
  static displayName = 'ArchContainer'
  static propTypes = {
    // 请按照首字母的顺序进行排序
    adminAlert: PropTypes.shape({
      show: PropTypes.bool.isRequired
    }).isRequired,
    closeEditDialog: PropTypes.func.isRequired,
    createDialog: PropTypes.shape({
      show: PropTypes.bool.isRequired
    }).isRequired,
    editDialog: PropTypes.shape({
      show: PropTypes.bool.isRequired
    }).isRequired,
    fetchTableBodyData: PropTypes.func.isRequired,
    handleMessage: PropTypes.func.isRequired,
    hideAdminAlert: PropTypes.func.isRequired,
    hideCreateDialog: PropTypes.func.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    messageTips: PropTypes.shape({
      isShow: PropTypes.bool.isRequired
    }).isRequired,
    showCreateDialog: PropTypes.func.isRequired,
    showEnableCheckbox: PropTypes.arrayOf(PropTypes.string).isRequired,
    spinner: PropTypes.shape({
      show: PropTypes.bool.isRequired
    }).isRequired,
    startIndex: PropTypes.number.isRequired,
    tableData: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired
    })).isRequired,
    updateConditions: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.handleCloseMessage = this.handleCloseMessage.bind(this);
    this.handlePageAlertDismiss = this.handlePageAlertDismiss.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.closeEditDialog = this.closeEditDialog.bind(this);
    this.closeCreateDialog = this.closeCreateDialog.bind(this);
    this.handleEnableCheck = this.handleEnableCheck.bind(this);
    if (props.showEnableCheckbox.indexOf(baseDocId) !== -1) {
      this.state = {
        conditions: [{ field: 'enable', datatype: 'boolean', value: 'true' }]
      };
    } else {
      this.state = {
        conditions: []
      };
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  /**
   * [componentWillReceiveProps description]
   * @param  {Object} nextProps [description]
   * @return {[type]}           [description]
   */
  componentWillReceiveProps() {
  }

  // admin card actions
  handleCreate(/* event */) {
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

  handlePageAlertDismiss() {
    this.props.hideAdminAlert();
  }

  handleEnableCheck(event) {
    let e = event.target;
    const { itemsPerPage, startIndex } = this.props;
    let multiple = false;
    let conditions = [
      { field: 'enable', datatype: 'boolean', value: 'true' }
    ];
    if (e.checked) {
      conditions = [];
      multiple = true;
    }
    this.setState({
      multiple
    });
    this.props.updateConditions(conditions);
    this.props.fetchTableBodyData(baseDocId, itemsPerPage, startIndex, null, conditions);
  }

  // 关闭弹窗口
  handleCloseMessage() {
    this.props.handleMessage();
  }

  render() {
    const {
      editDialog,
      createDialog,
      adminAlert, spinner, messageTips,
    } = this.props;
    const { multiple } = this.state;

    let checkBoxContent = '';
    if (baseDocId === 'dept' || baseDocId === 'project'
        || baseDocId === 'bankaccount' || baseDocId === 'feeitem') {
      checkBoxContent = (
        <div style={{ display: 'inline-block', float: 'left' }}>
          <Checkbox checked={multiple} onChange={this.handleEnableCheck}>
            显示停用
          </Checkbox>
        </div>
      );
    }

    let value = '客商';
    getBaseDocTypes().forEach((item) => {
      if (item.id === baseDocId) {
        value = item.name;
      }
    });

    return (
      <div className="content">
        <div className="blank" />
        <Spinner show={spinner.show} text="努力加载中..." />
        <MessageTips
          isShow={messageTips.isShow} onHideEvent={this.handleCloseMessage}
          txt={messageTips.txt} autoHide
        />
        <AdminAlert
          show={adminAlert.show} bsStyle={adminAlert.bsStyle}
          onDismiss={this.handlePageAlertDismiss}
        >
          <p>{adminAlert.message}</p>
        </AdminAlert>
        <div>
          <div className="header">
            <div className="header-title">
              <span>{value}</span>
            </div>
          </div>
          <div className="btn-bar">
            {checkBoxContent}
            <div className="fr">
              <Button onClick={this.handleCreate}>新增</Button>
            </div>
          </div>
          <Table baseDocId={baseDocId} />
        </div>
        <AdminEditDialog
          className="edit-form"
          title="编辑"
          show={editDialog.show}
          onHide={this.closeEditDialog}
        >
          <BaseDocEditForm baseDocId={baseDocId} />
        </AdminEditDialog>
        <AdminEditDialog
          className="create-form"
          title="新增"
          show={createDialog.show}
          onHide={this.closeCreateDialog}
        >
          <BaseDocCreateForm baseDocId={baseDocId} />
        </AdminEditDialog>
      </div>
    );
  }
}

/**
 * @param {Object} state
 * @param {Object} ownProps
 */
const mapStateToProps = state => ({ ...state.arch,
  arch: state.arch,
  tableData: state.arch.tableData,
  fields: state.arch.fields,
  totalPage: state.arch.totalPage
});

const mapDispatchToProps = dispatch => bindActionCreators(Actions, dispatch);

// The component will subscribe to Redux store updates.
export default connect(mapStateToProps, mapDispatchToProps)(TableContainer);
