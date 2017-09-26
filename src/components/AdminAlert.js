import React, { Component, PropTypes } from 'react';
import { Button, Alert } from 'react-bootstrap';

class AdminAlert extends Component {
  static propTypes = {
    show: PropTypes.bool,
    bsStyle: PropTypes.string,
    onDismiss: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  handleAlertDismiss() {
    if (this.props.onDismiss) {
      this.props.onDismiss();
    }
  }

  render() {
    const { show, bsStyle } = this.props;
    if (show) {
      return (
        <div className='admin-alert'>
          <Alert bsStyle={bsStyle} onDismiss={::this.handleAlertDismiss}>
            {this.props.children}
            <p>
              <Button onClick={::this.handleAlertDismiss}>关闭</Button>
            </p>
          </Alert>
        </div>
      );
    } else {
      return (
        <div className='admin-alert'></div>
      )
    }
  }
}

export default AdminAlert;
