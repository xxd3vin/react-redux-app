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
import _ from 'lodash';

import FormPanel from '../components/FormPanel';
import * as Actions from '../actions/mappingDef';

/**
 * 会计平台 - 转换规则定义
 * 后端接口文档：http://git.yonyou.com/sscplatform/fc_doc/blob/master/exchanger/mapdef.md
 */

class MappingDefEditForm extends Component {
  constructor(props) {
    super(props);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentWillMount() {
    // 如果用户刷新了页面，store中的数据就清空了，需要返回到列表页面再次获取数据
    if (_.isEmpty(this.props.tableColumnsModel).valueOf()) {
      this.context.router.push('/mapping-def2');
    }
  }

  componentDidMount() {
    document.title = '转换规则定义 编辑';
  }

  componentWillReceiveProps(/* nextProps */) {
  }

  handleFormSubmit(formData) {
    this.props.updateTableBodyDataAndFetchTableBodyData(formData);
  }

  render() {
    const {
      tableColumnsModel,
      tableBodyData
    } = this.props;

    // 从表格中取出需要编辑的行
    const formData = tableBodyData.find(
      row => row.id === this.props.params.id
    );

    return (
      <FormPanel
        className="mapping-def-edit-form-container"
        formData={formData}
        formTitle="编辑转换规则定义"
        onFormSubmit={this.handleFormSubmit}
        serverMessage={this.props.serverMessage}
        fieldsModel={tableColumnsModel}
      />
    );
  }
}

MappingDefEditForm.contextTypes = {
  router: PropTypes.object.isRequired
};

MappingDefEditForm.propTypes = {
  // react-router
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  // actions
  updateTableBodyDataAndFetchTableBodyData: PropTypes.func.isRequired,
  // store
  serverMessage: PropTypes.string.isRequired,
  tableBodyData: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired
  })).isRequired,
  tableColumnsModel: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired
  })).isRequired
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
export default connect(mapStateToProps, mapDispatchToProps)(MappingDefEditForm);
