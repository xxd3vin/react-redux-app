/**
 * 基础档案
 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Form as SSCForm } from 'ssc-grid';

import * as Actions from '../../actions/arch';

class BaseDocCreateForm extends Component {
  static displayName = 'BaseDocCreateForm'
  static propTypes = {
    baseDocId: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      datatype: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    })).isRequired,
    hideCreateDialog: PropTypes.func.isRequired,
    saveTableDataAndFetchTableBodyData: PropTypes.func.isRequired,
    serverMessage: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.handleCreateFormSubmit = this.handleCreateFormSubmit.bind(this);
    this.handleCreateFormReset = this.handleCreateFormReset.bind(this);
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

  // create form
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
    const { fields, baseDocId } = this.props;

    // ref is " user " add param : personmobile
    // bug des: 传入手机号为空

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

    this.props.saveTableDataAndFetchTableBodyData(baseDocId, fields, formData);
  }
  handleCreateFormReset(event) {
    this.props.hideCreateDialog();
    event.preventDefault();
  }

  /**
   * 根据列模型和表格体数据来构建空表单需要的数据
   * 以参照来举例，需要现从columnsModel中的type来现确认哪个字段是参照，然后从
   * tableData中获取参照的具体信息，一般是：
   * ```json
   * { id: '', code: '', name: '' }
   * ```
   */
  getFormDefaultData() {
    const { fields } = this.props;
    let formData = {};
    fields.forEach((fieldModel) => {
      // 隐藏字段，比如id字段，不用初始化值
      if (fieldModel.hidden === true) {
        return;
      }
      const fieldId = fieldModel.id;
      switch (fieldModel.type) {
        case 'ref':
          formData[fieldId] = {
            id: '',
            code: '',
            name: ''
          };
          break;
        case 'boolean':
          // 复选框应该设置默认值为false，也就是没有勾选
          if (fieldModel.type === 'boolean') {
            formData[fieldId] = false;
          }
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

  render() {
    const { fields } = this.props;
    let cols = fields;

    // 点击添加按钮时候，表单应该是空的，这里创建表单需要的空数据
    const formDefaultData = this.getFormDefaultData();

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
        <p className="server-message">{this.props.serverMessage}</p>
        <SSCForm
          fieldsModel={cols}
          defaultData={formDefaultData}
          onSubmit={this.handleCreateFormSubmit}
          onReset={this.handleCreateFormReset}
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
export default connect(mapStateToProps, mapDispatchToProps)(BaseDocCreateForm);
