/**
 * 友报账
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Promise from 'promise-polyfill';
// IE11不支持Array.prototype.find()
import 'core-js/fn/array/find';
// 左树结构样式
import 'rc-tree/assets/index.css';

/**
 * Import the stylesheet you want used!
 */
// 参照组件样式
import './styles/refer/referStyle.css';

/**
 * 在这里引用友报账的样式文件
 */
import './styles/ybz.less';

/**
 * Both configureStore and Root are required conditionally.
 * See configureStore.js and Root.js for more details.
 */
import { configureStore } from './store/configureStore';
import { Root } from './containers/Root';

// IE11
if (!window.Promise) {
  window.Promise = Promise;
}

const store = configureStore();

ReactDOM.render(
  <Root store={store} />,
  document.getElementById('root')
);
