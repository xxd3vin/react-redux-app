import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import * as Actions from '../../actions/arch';
import getBaseDocTypes from '../../constants/BaseDocTypes';

class BaseDocIndex extends Component {
  // constructor(props) {
  //   super(props);
  // }

  componentWillMount() {
  }

  render() {
    return (
      <div>
        <h1>基础档案所有类型</h1>
        <ul>
          {getBaseDocTypes().map(basedoc => <span style={{ marginRight: '10px' }} key={basedoc.id}>
            <Link
              to={`/basedocs-no-sidebar/basedoc/${basedoc.id}`}
              activeStyle={{ color: 'red' }}
            >{basedoc.name}</Link></span>)}
        </ul>
        <h2>详情</h2>
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

/**
 * @param {Object} state
 * @param {Object} ownProps
 */
const mapStateToProps = state => ({ ...state.arch });

const mapDispatchToProps = dispatch => bindActionCreators(Actions, dispatch);

// The component will subscribe to Redux store updates.
export default connect(mapStateToProps, mapDispatchToProps)(BaseDocIndex);
