import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Grid, Row, Col, Button, Modal } from 'react-bootstrap';

import NormalWidget from '../components/NormalWidget';
import AdminTable from '../components/AdminTable';
import AdminCardActions from '../components/AdminCardActions';
import AdminEditDialog from '../components/AdminEditDialog';
import AdminAlert from '../components/AdminAlert';
import AdminEditForm from '../components/AdminEditForm';

import * as Actions from '../actions/permission';

// Consants for table
const itemsPerPage = 5;
const startIndex = 1;

class PermissionPage extends Component {
  static propTypes = {
    //dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchTableData(itemsPerPage, startIndex);
  }

  // admin card actions
  handleCreate(event) {
    this.props.showCreateDialog();
  }
  handleUpdate(event) {
  }
  handleDelete(event) {
    this.props.deleteTableData();
  }

  closeEditDialog() {
    this.props.hideEditDialog();
  }

  closeCreateDialog() {
    this.props.hideCreateDialog();
  }

  // create form
  handleCreateFormBlur(label, value) {
    this.props.updateCreateFormFieldValue(label, value);
  }
  handleCreateFormSubmit() {
    this.props.submitCreateForm();
  }

  // edit form
  handleEditFormBlur(label, value) {
    this.props.updateEditFormFieldValue(label, value);
  }
  handleEditFormSubmit() {
    this.props.submitEditForm();
  }

  handleAlertDismiss(){
    this.props.hideAdminAlert();
  }

  // http://git.yonyou.com/sscplatform/ssc_web/commit/767e39de04b1182d8ba6ad55636e959a04b99d2b#note_3528
  //handlePagination(event, selectedEvent) {
  handlePagination(eventKey) {
    const { tableData } = this.props;
    
    //let page = selectedEvent.eventKey;
    let page = eventKey;

    //if (page == this.state.activePage) return;

    let startIndex = (page-1) * itemsPerPage + 1;
    //this.props.changePage(startIndex);
    this.props.fetchTableData(itemsPerPage, startIndex);
  }

  handleSelectOne(rowIdx, checked) {
    var rows = this.state.selectedRows;
    rows[rowIdx] = checked;
    this.setState({
      selectedRow: rows
    });

    this.props.changeSelectedRows(rowIdx, checked);
  }

  handleEdit(rowIdx, rowData) {
    this.props.showEditDialog(rowIdx, rowData);
    this.props.initEditFormData(rowData.cols);
  }

  handleCellChecked(rowIdx, colIdx) {
    this.props.changePermission(rowIdx, colIdx);
  }

  render() {
    const {
      tableData,
      editDialog, editFormData,
      createDialog, createFormData,
      adminAlert
    } = this.props;

    const cols = [
      '权限',
      '管理员',
      '业务员'
    ];

    return (
      <div>
        <AdminAlert {...this.props} show={adminAlert.show} bsStyle={adminAlert.bsStyle} message={adminAlert.message}
          onDismiss={::this.handleAlertDismiss}
        />
        <Grid>
          <Row className="show-grid">
            <Col md={12}>
              <h1>权限配置/权限分配/权限配置应用注册</h1>
              <AdminCardActions
                handleCreate={::this.handleCreate}
                handleUpdate={::this.handleUpdate}
                handleDelete={::this.handleDelete} />
            </Col>
          </Row>
          <Row className="show-grid">
            <Col md={12}>
              <NormalWidget />
              <AdminTable
                cols={cols} tableData={tableData} itemsPerPage={itemsPerPage}
                onPagination={::this.handlePagination}
                onSelectOne={::this.handleSelectOne}
                onEdit={::this.handleEdit}
                onCellChecked={::this.handleCellChecked}
                paging={false}
              />
            </Col>
          </Row>
        </Grid>
        <AdminEditDialog className='edit-form' title='编辑' {...this.props} show={editDialog.show} onHide={::this.closeEditDialog}>
          <AdminEditForm
            editFormDefaultData={editFormData}
            onBlur={::this.handleEditFormBlur}
            onSubmit={::this.handleEditFormSubmit}
          />
        </AdminEditDialog>
        <AdminEditDialog className='create-form' title='创建' {...this.props} show={createDialog.show} onHide={::this.closeCreateDialog}>
          <AdminEditForm
            editFormDefaultData={createFormData}
            onBlur={::this.handleCreateFormBlur}
            onSubmit={::this.handleCreateFormSubmit}
          />
        </AdminEditDialog>
      </div>
    );
  }
};

function mapStateToProps(state) {
  return { ...state.permission };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

// The component will subscribe to Redux store updates.
export default connect(mapStateToProps, mapDispatchToProps)(PermissionPage);
