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

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import Tree, { TreeNode } from 'rc-tree';
import { Button } from 'react-bootstrap';

import { fieldModelShape, tableRowShape } from './PropTypes';
import * as Actions from '../actions/entityMap';

import EntityMapTable from './EntityMapTable';

const DEFAULT_EXPANDED_LEVEL = 2;

/**
 * 需求是让默认展开三层结构
 * 需要在数组中列出所有需要展开的node的key
 * @param {Array} treeData 根据数据展开前三层节点
 * @return {Array} 需要展开的node的key
 */
function getDefaultExpandedKeys([...treeData]) {
  let expandedKeys = [];
  let level = 1;
  const loop = (nodes) => {
    nodes.forEach((node) => {
      if (level === DEFAULT_EXPANDED_LEVEL) {
        return;
      }

      expandedKeys.push(node.key);
      if (node.children) {
        level += 1;
        loop(node.children);
        level -= 1;
      }
    });
  };
  loop(treeData);
  return expandedKeys;
}

/**
 * 【友账表】 会计平台 - 实体映射
 * UI：左树右卡
 * API文档：
 * 1. 左树：
 * 1. 右卡：http://git.yonyou.com/sscplatform/fc_doc/blob/master/exchanger/entitytreenode.md
 */

class EntityMap extends Component {
  static displayName = 'EntityMap'
  static propTypes = {
    entityFieldsModel: PropTypes.arrayOf(fieldModelShape).isRequired,
    entityTableBodyData: PropTypes.arrayOf(tableRowShape).isRequired,
    fetchLeftTree: PropTypes.func.isRequired,
    fetchLeftTreeNodeChildren: PropTypes.func.isRequired,
    fetchTreeNodeDataAndSaveClickedNodeData: PropTypes.func.isRequired,
    /**
     * URL传参
     * ```js
     * {
     *   billTypeCode,
     *   mappingDefId
     * }
     * ```
     */
    params: PropTypes.shape({
      billTypeCode: PropTypes.string.isRequired,
      mappingDefId: PropTypes.string.isRequired
    }).isRequired,
    clickedTreeNodeData: PropTypes.object.isRequired,
    saveClickedNodeData: PropTypes.func.isRequired,
    showCreateDialog: PropTypes.func.isRequired,
    /**
     * [store] 左侧树的数据
     */
    treeData: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
      startIndex: 0,
      billTypeCode: this.props.params.billTypeCode,
      mappingDefId: this.props.params.mappingDefId
    };
    this.handleCreate = this.handleCreate.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onLoadData = this.onLoadData.bind(this);
  }

  componentWillMount() {
  }

  componentDidMount() {
    const { billTypeCode, mappingDefId } = this.state;
    // this.props.fetchEntityFieldsModel();
    this.props.fetchLeftTree(billTypeCode, mappingDefId);
    document.title = '实体映射';
  }

  componentWillReceiveProps(/* nextProps */) {
  }

  // 点击“创建”按钮
  handleCreate(/* event */) {
    const { entityTableBodyData } = this.props;
    const rowData = entityTableBodyData[0];
    this.props.showCreateDialog(true, rowData);
    // event.preventDefault();
  }

  /**
   * @param {Array} selectedKeys 所有选中的节点的key属性
   * @param {Object} e {selected: bool, selectedNodes, node, event}
   */
  onSelect(selectedKeys, e) {
    let currentNodeKey = e.node.props.treeNodeData.key;
    let lastNodeKey = this.props.clickedTreeNodeData.key;
    if (currentNodeKey !== lastNodeKey) {
      this.props.fetchTreeNodeDataAndSaveClickedNodeData(e.node.props.treeNodeData);
    } else {
      this.props.saveClickedNodeData(e.node.props.treeNodeData);
    }
  }

  /**
   * 用户点击节点左侧加号打开节点的时候
   */
  onLoadData(treeNode) {
    const emptyPromise = new Promise(resolve => resolve());

    const ENABLE_LAZY_LOAD = 0;
    if (!ENABLE_LAZY_LOAD) {
      return emptyPromise;
    }

    // TODO 因为使用了callAPIMiddleware导致如下调用返回的结果可能是Promise也可能
    // 是undefined
    const promise = this.props.fetchLeftTreeNodeChildren(treeNode.props.eventKey);
    if (promise) {
      return promise;
    }
    return emptyPromise;
  }

  render() {
    const loop = data => data.map((item) => {
      if (item.children) {
        return (
          <TreeNode
            title={item.title}
            key={item.key}
            treeNodeData={item}
          >
            {loop(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={item.title}
          key={item.key}
          isLeaf={item.isLeaf}
          treeNodeData={item}
        />
      );
    });

    const treeNodes = loop(this.props.treeData);
    const defaultExpandedKeys = getDefaultExpandedKeys(this.props.treeData);

    return (
      <div>
        <div className="head">
          <Button onClick={browserHistory.goBack}>返回</Button>
          {' '}
          <button
            className="btn btn-default"
            onClick={this.handleCreate}
            disabled={this.props.entityFieldsModel.length === 0}
          >
            新增
          </button>
        </div>
        <div className="ledger-content clearfix">
          <div className="ledger-content-left">
            {
              this.props.treeData.length !== 0
              ?
                <Tree
                  onSelect={this.onSelect}
                  defaultExpandedKeys={defaultExpandedKeys}
                  loadData={this.onLoadData}
                >
                  { treeNodes }
                </Tree>
              : null
            }
          </div>
          <div className="ledger-content-right">
            <EntityMapTable />
          </div>
        </div>
      </div>
    );
  }
}

/**
 * @param {Object} state
 * @param {Object} ownProps
 */
const mapStateToProps = state => ({ ...state.entityMap });


const mapDispatchToProps = dispatch => bindActionCreators(Actions, dispatch);

// The component will subscribe to Redux store updates.
export default connect(mapStateToProps, mapDispatchToProps)(EntityMap);
