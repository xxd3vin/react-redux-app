import React, { Component, PropTypes } from 'react';

//import 'rc-tree/assets/index.css';
import Tree, { TreeNode } from 'rc-tree';

export default class AdminTree extends Component {
  static propTypes = {
    rootNode: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }


  render() {
    const { rootNode } = this.props;

    /**
     * @param {Object} node - Sample data:
     * ```json
     * const node = {
     *   id: '0',
     *   name: '(only one) root node',
     *   children: {
     *     0: {
     *       id: '0-0',
     *       name: 'node 0-0'
     *     },
     *     1: {
     *       id: '0-1',
     *       name: 'node 0-1',
     *       children: {
     *         0: {
     *           id: '0-1-0',
     *           name: 'node 0-1-0'
     *         }
     *       }
     *     },
     *     2: {
     *       id: '0-2',
     *       name: 'node 0-2'
     *     }
     *   }
     * }
     * ```
     * Note: the type of `children` prop is `Object`, not `Array`.
     */
    const nodeVisitor = (node) => {
      //console.log(`node id is ${node.id}, node name is ${node.name}`);
      let children = node.children || [];
      return (
        <TreeNode title={node.name} key={node.id}>
          {Object.keys(children).map(key => nodeVisitor(children[key]))}
        </TreeNode>
      )
    }

    const renderConfigTree = (treeRootNode) => {
      if (treeRootNode) {
        return (
          <Tree defaultExpandAll={true}>
            {nodeVisitor(treeRootNode)}
          </Tree>
        )
      }
    }

    return (
      <div className='admin-tree'>
        {renderConfigTree(rootNode)}
      </div>
    );
  }
}
