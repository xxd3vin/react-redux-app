import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DemoActions from '../actions/demo';
import _ from 'lodash';

import { Link } from 'react-router';
import { Grid, Row, Col, Button, Modal } from 'react-bootstrap';

import AdminEditForm from '../components/AdminEditForm';

class DemoFormContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    const defaultData1 = [
      { type: 'text', label: 'col1', value: 'row1, col1' },
      { type: 'text', label: 'col2', value: 'row1, col2' }
    ];
    const defaultData2 = [
      { type: 'text', label: 'col1', value: 'row2, col1' },
      { type: 'text', label: 'col2', value: 'row2, col2' }
    ];
    dispatch(DemoActions.initDemoEditForm1Data(defaultData1));
    dispatch(DemoActions.initDemoEditForm2Data(defaultData2));
  }

  handleDemoEditForm1Blur(label, value) {
    const { dispatch } = this.props;
    dispatch(DemoActions.updateDemoEditForm1FieldValue(label, value));
  }

  handleDemoEditForm2Blur(label, value) {
    const { dispatch } = this.props;
    dispatch(DemoActions.updateDemoEditForm2FieldValue(label, value));
  }

  handleDemoEditForm1Submit() {
    const { dispatch } = this.props;
    //dispatch(DemoActions.updateRow());
  }
  handleDemoEditForm2Submit() {
    const { dispatch } = this.props;
    //dispatch(DemoActions.updateRow());
  }

  render() {
    const { editFormData1, editFormData2 } = this.props;
    const { dispatch } = this.props;
    return (
      <div>
        <AdminEditForm
          editFormDefaultData={editFormData1}
          onBlur={::this.handleDemoEditForm1Blur}
          onSubmit={::this.handleDemoEditForm1Submit}
        />
        <AdminEditForm
          editFormDefaultData={editFormData2}
          onBlur={::this.handleDemoEditForm2Blur}
          onSubmit={::this.handleDemoEditForm2Submit}
        />
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    editFormData1: state.demo.editFormData1,
    editFormData2: state.demo.editFormData2
  }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(DemoActions, dispatch);
}

// The component will subscribe to Redux store updates.
export default connect(mapStateToProps/*, mapDispatchToProps*/)(DemoFormContainer);
