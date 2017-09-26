import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';

class AdminCardActions extends Component {
  static propTypes = {
    handleCreate: PropTypes.func.isRequired,
    handleUpdate: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
  }

  handleCreate(event) {
    event.preventDefault();
    this.props.handleCreate();
  }
  handleUpdate(event) {
    event.preventDefault();
    this.props.handleUpdate();
  }
  handleDelete(event) {
    event.preventDefault();
    this.props.handleDelete();
  }

  render() {
    const { children } = this.props;
    return (
      <div style={{ display: 'inline-block', float: 'right' }}>
        <Button onClick={::this.handleCreate}>创建</Button>
        <Button onClick={::this.handleUpdate}>修改</Button>
        <Button onClick={::this.handleDelete}>删除</Button>
        {
          // Try to custom this component
          //React.Children.toArray(children).map((field, key) => (
          //  <field.type key={key} onClick={field.onClick}>
          //    {field.props.children}
          //  </field.type>
          //))
        }
      </div>
    );
  }
};

export default AdminCardActions;
