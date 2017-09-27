/**
 * 转换规则定义
 */

import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import classNames from 'classnames';

import { Button, Grid, Row, Col } from 'react-bootstrap';
import { Form as SSCForm } from 'ssc-grid';

/**
 * 会计平台 - 转换规则定义
 * 后端接口文档：http://git.yonyou.com/sscplatform/fc_doc/blob/master/exchanger/mapdef.md
 */

class FormPanel extends Component {
  // constructor(props) {
  //   super(props);
  // }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillReceiveProps(/* nextProps */) {
  }

  handleFormSubmit(formData) {
    this.props.onFormSubmit(formData);
  }

  render() {
    const {
      fieldsModel
    } = this.props;

    return (
      <div
        className={classNames(this.props.className, 'content')}
        style={{
          padding: '2em'
        }}
      >
        <p className="server-message" style={{ color: 'red' }}>
          {this.props.serverMessage}
        </p>
        <div
          className="card"
          style={{
            padding: '1em',
            backgroundColor: 'rgb(255, 255, 255)',
            boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px'
          }}
        >
          <Grid
            style={{
              padding: 0,
              margin: 0
            }}
          >
            <Row>
              <Col md={10}>
                <h3
                  style={{
                    margin: 0
                  }}
                >{this.props.formTitle}</h3>
              </Col>
              <Col md={2}>
                <Button onClick={browserHistory.goBack}>返回列表</Button>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <SSCForm
                  fieldsModel={fieldsModel}
                  defaultData={this.props.formData}
                  layout={{
                    columnCount: 3,
                    columnWidth: 4
                  }}
                  onSubmit={this.handleFormSubmit}
                  onReset={browserHistory.goBack}
                />
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    );
  }
}

FormPanel.contextTypes = {
  router: PropTypes.object.isRequired
};

FormPanel.propTypes = {
  className: PropTypes.string.isRequired,
  formData: PropTypes.shape({
    name: PropTypes.string
  }),
  formTitle: PropTypes.string.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  serverMessage: PropTypes.string,
  fieldsModel: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired
  })).isRequired
};

FormPanel.defaultProps = {
  formData: {},
  serverMessage: ''
};

export default FormPanel;
