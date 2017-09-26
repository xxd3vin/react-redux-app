/**
 * 基础档案
 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import { Form as SSCForm } from 'ssc-grid';

import AdminAlert from '../../components/AdminAlert';

import * as Actions from '../../actions/arch';

class BaseDocEditForm extends Component {
  static displayName = 'BaseDocEditForm'
  static propTypes = {
    baseDocId: PropTypes.string.isRequired,
    closeEditDialog: PropTypes.func.isRequired,
    conditions: PropTypes.arrayOf(PropTypes.shape({
      field: PropTypes.string.isRequired,
      datatype: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })).isRequired,
    editDialog: PropTypes.shape({
      rowIdx: PropTypes.number
    }).isRequired,
    editFormData: PropTypes.shape({
      id: PropTypes.string
    }).isRequired,
    formAlert: PropTypes.shape({
      show: PropTypes.bool.isRequired
    }).isRequired,
    fields: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      datatype: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    })).isRequired,
    hideAdminAlert: PropTypes.func.isRequired,
    saveTableDataAndFetchTableBodyData: PropTypes.func.isRequired,
    startIndex: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props);
    this.handleFormAlertDismiss = this.handleFormAlertDismiss.bind(this);
    this.handleEditFormSubmit = this.handleEditFormSubmit.bind(this);
    this.handleEditFormReset = this.handleEditFormReset.bind(this);
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  /**
   * @param {Object} nextProps
   */
  componentWillReceiveProps() {
  }

  // edit form
  handleEditFormSubmit(formData) {
    const { startIndex, fields, editDialog: { rowIdx } } = this.props;
    const { baseDocId } = this.props;

    let phoneList = ['project', 'dept', 'feeitem'];
    _.map(phoneList, (obj) => {
      if (baseDocId === obj) {
        if (formData.person) {
          if (formData.person.phone) {
            formData.personmobile = formData.person.phone;
          }
          if (formData.person.mobile) {
            formData.personmobile = formData.person.mobile;
          }
        }
      }
    });

    if (baseDocId === 'bankaccount') {
      if (formData.depositbank) {
        formData.bank = formData.depositbank;
      }
    }

    this.props.saveTableDataAndFetchTableBodyData(baseDocId, fields, formData, rowIdx);
  }
  handleEditFormReset(event) {
    this.props.closeEditDialog();
    event.preventDefault();
  }

  handleFormAlertDismiss() {
    this.props.hideAdminAlert();
  }

  render() {
    const { fields, editFormData, formAlert } = this.props;

    // 表单字段模型 / 表格列模型
    let cols = fields || [];
    function setFormatterBoolean(field) {
      switch (field.type) {
        case 'boolean':
          field.formatter = {
            type: 'custom',
            callback(value) {
              return value ? '是' : '否';
            }
          };
          break;
        default:
          break;
      }
      return field;
    }
    cols = cols.map(setFormatterBoolean);

    return (
      <div>
        <AdminAlert
          show={formAlert.show} bsStyle={formAlert.bsStyle}
          onDismiss={this.handleFormAlertDismiss}
        >
          <p>{formAlert.message}</p>
        </AdminAlert>
        <SSCForm
          fieldsModel={cols}
          defaultData={editFormData}
          onSubmit={this.handleEditFormSubmit}
          onReset={this.handleEditFormReset}
        />
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
export default connect(mapStateToProps, mapDispatchToProps)(BaseDocEditForm);
