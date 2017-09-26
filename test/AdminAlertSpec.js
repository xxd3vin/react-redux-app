import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';

import AdminAlert from '../src/components/AdminAlert';

describe('<AdminAlert>', () => {

  it('应该正确显示提示信息', () => {
    let instance = ReactTestUtils.renderIntoDocument(
      <AdminAlert
        show
        bsStyle="danger"
      >
        <p>test</p>
      </AdminAlert>
    );
    let node = ReactDOM.findDOMNode(instance); // <div> root node
    let ps = node.querySelectorAll('p'); // <table>
    assert.equal(ps[0].textContent, 'test');
  });

});
