import React, { Component } from 'react';

export default class Footer extends Component {
  render() {
    return (
      <div className="footer-component" style={{margin:"0 auto;text-align:center"}} >
        <a href="#" target="_blank">帮助中心 </a>
        <a href="#" target="_blank">说明</a>|用友旗下网站
      </div>
    );
  }
};
