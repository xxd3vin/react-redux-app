import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import 'rc-tree/assets/index.css';
import Tree, { TreeNode } from 'rc-tree';

import * as DemoActions from '../actions/demo';

class DemoTreeContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  render() {
    const { dispatch } = this.props;
    return (
      <div>
        <Tree>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="leaf" key="0-0-0" />
          </TreeNode>
        </Tree>
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(DemoActions, dispatch);
}

// The component will subscribe to Redux store updates.
export default connect(mapStateToProps/*, mapDispatchToProps*/)(DemoTreeContainer);
