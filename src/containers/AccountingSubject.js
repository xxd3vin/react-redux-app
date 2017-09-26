/**
 * Created by Tiger on 17/3/23.
 */
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { Grid, Row, Col, Button, Modal } from 'react-bootstrap';

import { Grid as SSCGrid, Form as SSCForm } from 'ssc-grid';

import AdminEditDialog from '../components/AdminEditDialog';
import AdminAlert from '../components/AdminAlert';
import MessageConfirm from '../components/MessageConfirm';

import * as Actions from '../actions/accountingSubject';

class AccountingSubject extends Component {
  static PropTypes = {
    /**
     * [store] 字段模型
     */
    fields: PropTypes.array.isRequired,
    /**
     * [store] 表体数据
     */
    tableData: PropTypes.array.isRequired
  }

  state = {
  }

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { itemsPerPage, startIndex } = this.props;
    this.props.fetchTableBodyData(this.props.params.baseDocId, itemsPerPage, startIndex);
    this.props.fetchTableColumnsModel(this.props.params.baseDocId);
    this.props.fetchChildSubjectTableColumnsModel(this.props.params.baseDocId);
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    const { itemsPerPage, startIndex } = this.props;
    const nextType = nextProps.params.baseDocId;
    const currentType = this.props.params.baseDocId;
    // 当跳转到其他类型的基础档案时候，重新加载表格数据
    if (nextType !== currentType) {
      this.props.fetchTableBodyData(nextType, itemsPerPage, startIndex);
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

  closeChildDialog() {
    this.props.closeChildDialog();
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
  handleCreateFormSubmit(formData) {
    const { itemsPerPage, startIndex, fields, params: { baseDocId } } = this.props;
    // this.props.submitCreateForm();
    // this.props.saveTableData(baseDocId, fields, formData);
    // this.props.fetchTableBodyData(baseDocId, itemsPerPage, startIndex);

    //ref is " user " add param : personmobile
    // bug des: 传入手机号为空


    var phoneList =  ["project" , "dept" , "feeitem"] ;
    _.map(phoneList,function( obj ,ind ){
      if( baseDocId == obj ){
        if(formData.person.phone){
          formData.personmobile =  formData.person.phone ;
        }
      }
    })

    if(baseDocId == "bankaccount"){
      if(formData.depositbank){
        formData.bank = formData.depositbank ;
      }
    }

    this.props.saveTableDataAndFetchTableBodyData(baseDocId, fields, formData, null, startIndex);
  }
  handleCreateFormReset(event) {
    this.props.hideCreateDialog();
    event.preventDefault();
  }

  // edit form
  handleEditFormBlur(index, fieldModel, value) {
    //this.props.updateEditFormFieldValue(index, fieldModel, value);
  }
  handleEditFormSubmit(formData) {
    const { startIndex, fields, editDialog: { rowIdx } } = this.props;
    const { baseDocId } = this.props.params;
    // this.props.submitEditForm();
    // this.props.saveTableData(baseDocId, fields, formData, rowIdx);
    var phoneList =  ["project" , "dept" , "feeitem"] ;
    _.map(phoneList,function( obj ,ind ){
      if( baseDocId == obj ){
        if(formData.person.phone){
          formData.personmobile =  formData.person.phone ;
        }
      }
    })

    if(baseDocId == "bankaccount"){
      if(formData.depositbank){
        formData.bank = formData.depositbank ;
      }
    }

    this.props.updateTableDataAndFetchTableBodyData(baseDocId, fields, formData, rowIdx, startIndex);
  }
  handleEditFormReset(event) {
    this.props.closeEditDialog();
    event.preventDefault();
  }

  // add child form
  handleChildFormBlur(index, fieldModel, value) {
    //this.props.updateEditFormFieldValue(index, fieldModel, value);
  }
  handleChildFormSubmit(formData) {
    const { startIndex, fields, childDialog: { rowIdx }, childFormData } = this.props;
    const { baseDocId } = this.props.params;

    // childFormData 是rowData
    let rowData = childFormData;
    this.props.addTableDataAndFetchTableBodyData(baseDocId, fields, formData, rowData, rowIdx, startIndex);
  }
  handleChildFormReset(event) {
    this.props.closeChildDialog();
    event.preventDefault();
  }

  handlePageAlertDismiss(){
    this.props.hideAdminAlert();
  }

  handleFormAlertDismiss(){
    this.props.hideAdminAlert();
  }

  /**
   * 用户点击下一页的时候，组件先向后端请求数据，等数据回来之后，再把分页组件
   * 跳转到下一页。这样就能避免用户快速点击的问题了。
   */
  // http://git.yonyou.com/sscplatform/ssc_web/commit/767e39de04b1182d8ba6ad55636e959a04b99d2b#note_3528
  //handlePagination(event, selectedEvent) {
  handlePagination(eventKey) {
    const { itemsPerPage, tableData } = this.props;
    let nextPage = eventKey;
    let startIndex = (nextPage-1) * itemsPerPage;

    this.props.fetchTableBodyDataAndGotoPage(this.props.params.baseDocId, itemsPerPage, startIndex, nextPage);
  }

  getCustomComponent() {
    var containerThis = this;
    return React.createClass({
      handleEdit(event) {

        const { rowIdx, rowObj } = this.props;
        const { fields } = containerThis.props;

        var control = ["dept", "feeitemclass" , "projectclass","bank"]; // 需要过滤的参照类型
        _.map( fields , function(obj ,ind ){
          _.map(control, function( con ,i  ){
            if( con == obj.refCode  ){
              var rowObjCode = '{\"id\"=\"' + rowObj.id +'\"}';
              containerThis.props.updateReferFields(rowObjCode, ind );
            }
          })
        })

        // 将rowData保存到store中
        containerThis.props.showEditDialog(rowIdx, rowObj);
        // 从store中取出editFormData填充到表单上
        //containerThis.props.initEditFormData(rowObj);
      },
      handleRemove(event) {

        const { rowIdx, rowObj } = this.props;
        const { startIndex } = containerThis.props;
        const { baseDocId } = containerThis.props.params;
        var param ={
          isShow :true ,
          txt:"是否删除？",
          sureFn:function(){
            containerThis.props.deleteTableDataAndFetchTableBodyData(baseDocId, rowIdx, rowObj, startIndex);
          }
        };

        containerThis.refs.messageConfirm.initParam(param);

        // containerThis.props.deleteTableData(baseDocId, rowIdx, rowObj);
        // containerThis.props.fetchTableBodyData(baseDocId, containerThis.props.itemsPerPage, startIndex);

      },
      handleAddChildSubject(event) {
        const { rowIdx, rowObj } = this.props;
        const { fields } = containerThis.props;
        var control = ["dept", "feeitemclass" , "projectclass","bank"]; // 需要过滤的参照类型
        _.map( fields , function(obj ,ind ){
          _.map(control, function( con ,i  ){
            if( con == obj.refCode  ){
              var rowObjCode = '{\"id\"=\"' + rowObj.id +'\"}';
              containerThis.props.updateReferFields(rowObjCode, ind );
            }
          })
        })

        // 将rowData保存到store中
        containerThis.props.showChildDialog(rowIdx, rowObj);
      },
      render() {
        return (
          <td>
            <span onClick={::this.handleEdit}>修改</span>
            <span onClick={::this.handleRemove}>删除</span>
            <span onClick={::this.handleAddChildSubject}>新增子科目</span>
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
  getFormDefaultData(columnsModel, tableData, baseDocId) {
    let formData = {};
    columnsModel.forEach(fieldModel => {
      // 隐藏字段，比如id字段，不用初始化值
      if (fieldModel.hidden === true) {
        return;
      }
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
    const {
      tableData, fields, childSubjectFields,
      editDialog, editFormData,
      childDialog, childFormData,
      createDialog,
      adminAlert, formAlert,
      params: {
        baseDocId
      },
      itemsPerPage
    } = this.props;

    // 表单字段模型 / 表格列模型
    const cols = fields || [];
    const tableCols = cols.filter(function (field) {
      if(field.id ==='enable' || field.id === 'vr1' || field.id === 'vr2' || field.id === 'vr3') {
        return false;
      }else {
        return true;
      }
    });

    // 会计平台子科目表单字段模型 / 表格列模型
    const childSubjectCols = childSubjectFields || [];

    // 点击添加按钮时候，表单应该是空的，这里创建表单需要的空数据
    const formDefaultData = this.getFormDefaultData(cols, tableData, baseDocId);

    // 会计平台子科目的初始值设置为空
    const childFormDefaultData = this.getFormDefaultData(cols, tableData, baseDocId);

    return (
      <div className="content">
        <MessageConfirm  ref="messageConfirm"/>
        <p className="server-message">{this.props.serverMessage}</p>
        <div>
          <div className="btn-bar">
            <div className="fr">
              <Button onClick={::this.handleCreate}>新增</Button>
            </div>
          </div>
          <SSCGrid tableData={tableData} columnsModel={tableCols} className="ssc-grid"
                   paging
                   itemsPerPage={itemsPerPage}
                   totalPage={this.props.totalPage}
                   activePage={this.props.activePage}
                   onPagination={::this.handlePagination}
                   operationColumn={{}}
                   operationColumnClass={this.getCustomComponent()}
          />
        </div>
        <AdminEditDialog className='edit-form' title='编辑' {...this.props} show={editDialog.show} onHide={::this.closeEditDialog}>
          <p className="server-message">{this.props.serverMessage}</p>
          <SSCForm
            fieldsModel={cols}
            defaultData={editFormData}
            onBlur={::this.handleEditFormBlur}
            onSubmit={::this.handleEditFormSubmit}
            onReset={::this.handleEditFormReset}
          />
        </AdminEditDialog>
        <AdminEditDialog className='create-form' title='新增' {...this.props} show={createDialog.show} onHide={::this.closeCreateDialog}>
          <p className="server-message">{this.props.serverMessage}</p>
          <SSCForm
            fieldsModel={cols}
            defaultData={formDefaultData}
            onBlur={::this.handleCreateFormBlur}
            onSubmit={::this.handleCreateFormSubmit}
            onReset={::this.handleCreateFormReset}
          />
        </AdminEditDialog>
        <AdminEditDialog className='child-form' title='新增子科目' {...this.props} show={childDialog.show} onHide={::this.closeChildDialog}>
          <p className="server-message">{this.props.serverMessage}</p>
          <SSCForm
            fieldsModel={childSubjectCols}
            defaultData={childFormDefaultData}
            onBlur={::this.handleChildFormBlur}
            onSubmit={::this.handleChildFormSubmit}
            onReset={::this.handleChildFormReset}
          />
        </AdminEditDialog>
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {...state.accountingSubject,
    accountingSubject: state.accountingSubject,
    tableData: state.accountingSubject.tableData,
    fields: state.accountingSubject.fields,
    totalPage: state.accountingSubject.totalPage,
    childFormData: state.accountingSubject.childDialog.formData
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Actions, dispatch);
}

// The component will subscribe to Redux store updates.
export default connect(mapStateToProps, mapDispatchToProps)(AccountingSubject);
