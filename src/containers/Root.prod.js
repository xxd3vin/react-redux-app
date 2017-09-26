import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import Routers from './Routers';

/**
 * Component is exported for conditional usage in Root.js
 */
const Root = ({ store }) => (
  /**
   * Provider is a component provided to us by the 'react-redux' bindings that
   * wraps our app - thus making the Redux store/state available to our 'connect()'
   * calls in component hierarchy below.
   */
  <Provider store={store}>
    <div>
      {Routers}
    </div>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

module.exports = Root;
