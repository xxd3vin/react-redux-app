import React from 'react';
import { Link } from 'react-router';

export default class Top extends React.Component {
    constructor(props) {
        super(props);

    }
    logout = () => {
      window.location="/sscpub/logout";
    }
    getUserName = ()=> {
      var name = 'u_usercode=';
      var allCookie = document.cookie;
	    var pos = allCookie.indexOf(name);
      if(pos != -1){
        var start = pos + name.length;
        var end = allCookie.indexOf(";",start);
        if (end == -1){
          end = allCookie.length;
        }
        var value = allCookie.substring(start,end);
        return unescape(value);
      }else{
        return '';
      }
    }
    render() {
      let topStyles = {
        background: '#fff',
        height: '56px',
        width: '100%',
        zIndex: '100',
        position: 'fixed',
        top: '0px',
        boxShadow: '0px 3px 6px rgb(204, 204, 204)'
      };
      return (
        <div className="top-component" style={topStyles}>
          <div className="portal-nav-logo">
            {/*<img src="./images/public/logo.png"/>*/}
          </div>
          <div className="portal-nav-setting">
            您好,{this.getUserName()}   <a href="javascript:void(0);" onClick={this.logout}>注销</a>
              {/*<img src="images/demo/demo-portal-setting.png"/>*/}
          </div>
        </div>
      );
    }
};
