import React, { Component, PropTypes } from 'react';
import { Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';

class AdminEditForm extends Component {
  static propTypes = {
    editFormDefaultData: PropTypes.array.isRequired,
    onBlur: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  getValidationState() {
    //return 'error';
    //return 'warning';
    return 'success';
  }

  // Performance issue?
  // http://stackoverflow.com/questions/33266156/react-redux-input-onchange-is-very-slow-when-typing-in-when-the-input-have-a
  handleBlur(label, event) {
    this.props.onBlur(label, event.target.value);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmit();
  }

  handleReset() {
  }

  render() {
    const { editFormDefaultData } = this.props;

    const FieldGroup = ({ key, id, label, help, ...props }) => {
      return (
        <FormGroup key={key} controlId={id}>
          <ControlLabel>{label}</ControlLabel>
          <FormControl {...props} />
          {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
      );
    }

    return (
      <div className='admin-edit-form'>
        <form>
          {editFormDefaultData.map(col =>
            <FieldGroup
              key={col.label}
              id={`formControlsText-${col.label}`}
              type={col.type}
              label={col.label}
              placeholder="Enter text"
              defaultValue={col.value}
              onBlur={this.handleBlur.bind(this, col.label)}
            />
          )}
          <Button onClick={::this.handleSubmit} type="submit">保存</Button>
          <Button onClick={::this.handleReset} type="reset">清空</Button>
        </form>
      </div>
    );
  }
};

export default AdminEditForm;
