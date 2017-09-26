import React, { Component, PropTypes } from 'react';
import { Modal } from 'react-bootstrap';

class AdminEditDialog extends Component {
  static propTypes = {
    /**
     * 对话框标题
     */
    title: PropTypes.string.isRequired,
    /**
     * 是否显示对话框
     */
    show: PropTypes.bool.isRequired,
    /**
     * 该回调函数会在用户点击标题栏的关闭按钮时候触发
     */
    onHide: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  closeDialog() {
    if (this.props.onHide) {
      this.props.onHide();
    }
    // event.preventDefault();
  }

  render() {
    const { show, title } = this.props;

    return (
      <div className='admin-edit-dialog'>
        <Modal
          show={show}
          backdrop="static"
          onHide={::this.closeDialog}
        >
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              React.Children.map(this.props.children, child => {
                return React.cloneElement(child, {
                })
              })
            }
          </Modal.Body>
        </Modal>
      </div>
    );
  }
};

export default AdminEditDialog;
