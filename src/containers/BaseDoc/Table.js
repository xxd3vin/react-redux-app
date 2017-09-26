import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid as SSCGrid } from 'ssc-grid';

import MessageConfirm from '../../components/MessageConfirm';
import * as Actions from '../../actions/table';

class Table extends Component {
  static displayName = 'Table'
  static propTypes = {
    activePage: PropTypes.number.isRequired,
    baseDocId: PropTypes.string.isRequired,
    conditions: PropTypes.arrayOf(PropTypes.shape({
      field: PropTypes.string.isRequired,
      datatype: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })).isRequired,
    fetchTableBodyData: PropTypes.func.isRequired,
    fetchTableBodyDataAndGotoPage: PropTypes.func.isRequired,
    fetchTableColumnsModel: PropTypes.func.isRequired,
    fields: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      datatype: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    })).isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    showEnableCheckbox: PropTypes.arrayOf(PropTypes.string).isRequired,
    startIndex: PropTypes.number.isRequired,
    tableData: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired
    })).isRequired,
    totalPage: PropTypes.number.isRequired,
    updateConditions: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.handlePagination = this.handlePagination.bind(this);
  }

  componentWillMount() {
  }

  componentDidMount() {
    const { baseDocId, showEnableCheckbox } = this.props;
    const { itemsPerPage, startIndex } = this.props;
    // 根据不同基础档案类型，设置不同的默认查询条件
    let conditions = [];
    if (showEnableCheckbox.indexOf(baseDocId) !== -1) {
      conditions = [{ field: 'enable', datatype: 'boolean', value: 'true' }];
    }
    this.props.updateConditions(conditions);

    this.props.fetchTableColumnsModel(baseDocId);
    this.props.fetchTableBodyData(baseDocId, itemsPerPage, startIndex, null,
      conditions);
  }

  componentWillReceiveProps(nextProps) {
    const { itemsPerPage, startIndex } = this.props;
    const nextType = nextProps.baseDocId;
    const currentType = this.props.baseDocId;
    // 当跳转到其他类型的基础档案时候，重新加载表格数据
    if (nextType !== currentType) {
      // 根据不同基础档案类型，设置不同的默认查询条件
      let conditions = [];
      if (nextProps.showEnableCheckbox.indexOf(nextType) !== -1) {
        conditions = [{ field: 'enable', datatype: 'boolean', value: 'true' }];
      }
      this.props.updateConditions(conditions);

      this.props.fetchTableColumnsModel(nextType);
      this.props.fetchTableBodyData(nextType, itemsPerPage, startIndex, null,
        conditions);
    }
  }

  getCustomComponent() {
    let container = this;
    return React.createClass({
      handleEdit(/* event */) {
        const { rowIdx, rowObj } = this.props;
        const { fields } = container.props;

        let control = ['dept', 'feeitemclass', 'projectclass', 'bank']; // 需要过滤的参照类型
        _.map(fields, (obj, ind) => {
          _.map(control, (con) => {
            if (con === obj.refCode) {
              let rowObjCode = `{\"id\"=\"${rowObj.id}\"}`;
              container.props.updateReferFields(rowObjCode, ind);
            }
          });
        });

        // 修复后端数据中的null
        fields.forEach((field) => {
          if (field.type === 'string') {
            if (rowObj[field.id] === null) {
              rowObj[field.id] = '';
            }
          }
        });

        // 将rowData保存到store中
        container.props.showEditDialog(rowIdx, rowObj);
        // 从store中取出editFormData填充到表单上
        // container.props.initEditFormData(rowObj);
      },
      handleRemove(/* event */) {
        const { rowIdx, rowObj } = this.props;
        const { baseDocId } = container.props;
        let param = {
          isShow: true,
          txt: '是否删除？',
          sureFn() {
            container.props.deleteTableDataAndFetchTableBodyData(
              baseDocId, rowIdx, rowObj);
          }
        };

        container.refs.messageConfirm.initParam(param);

        // container.props.deleteTableData(baseDocId, rowIdx, rowObj);
        // container.props.fetchTableBodyData(baseDocId, container.props.itemsPerPage, startIndex);

      //
      },

      handleEnable() {
        const { rowObj } = this.props;
        const { baseDocId } = container.props;
        container.props.enableTableDataAndFetchTableBodyData(baseDocId, rowObj);
      },

      render() {
        let enable = this.props.rowObj.enable;
        const { baseDocId } = container.props;
        let resultDom = (<span onClick={this.handleRemove}>删除</span>);
        if (container.props.showEnableCheckbox.indexOf(baseDocId) !== -1) {
          resultDom = (<span onClick={this.handleEnable}>{enable === true ? '停用' : '启用'}</span>);
        }
        return (
          <td>
            <span onClick={this.handleEdit}>修改</span>
            {resultDom}
          </td>
        );
      }
    });
  }

  /**
   * 用户点击下一页的时候，组件先向后端请求数据，等数据回来之后，再把分页组件
   * 跳转到下一页。这样就能避免用户快速点击的问题了。
   */
  // http://git.yonyou.com/sscplatform/ssc_web/commit/767e39de04b1182d8ba6ad55636e959a04b99d2b#note_3528
  // handlePagination(event, selectedEvent) {
  handlePagination(eventKey) {
    const { itemsPerPage } = this.props;
    let nextPage = eventKey;
    let startIndex = (nextPage - 1) * itemsPerPage;
    this.props.fetchTableBodyDataAndGotoPage(this.props.baseDocId,
      itemsPerPage, startIndex, nextPage, this.props.conditions);
  }

  render() {
    const { tableData, fields, itemsPerPage } = this.props;

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
        <MessageConfirm ref="messageConfirm" />
        <SSCGrid
          tableData={tableData}
          columnsModel={cols}
          className="ssc-grid"
          paging
          itemsPerPage={itemsPerPage}
          totalPage={this.props.totalPage}
          activePage={this.props.activePage}
          onPagination={this.handlePagination}
          operationColumn={{}}
          operationColumnClass={this.getCustomComponent()}
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
export default connect(mapStateToProps, mapDispatchToProps)(Table);
