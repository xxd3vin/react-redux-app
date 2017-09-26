import React from 'react';
import { Link } from 'react-router';
import { Glyphicon } from 'react-bootstrap';

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let menuItemStyles = {
      listStyle: 'none',
      borderTop: '1px solid transparent',
      position: 'relative',
      cursor: 'pointer',
      overflowX: 'hidden'
    };
    let linkStyles = {
      display: 'block',
      height: '50px',
      paddingTop: '10px',
      paddingLeft: '20px'
    };
    let itemTitleStyles = {
      textAlign: 'center',
      lineHeight: '30px',
      color: '#ddd'
    };
    let logoStyles = {
      height: '55px',
      background: '#16243d',
      position: 'relative',
      lineHeight: '55px',
      fontSize: '20px',
      color: '#FFF',
      paddingLeft: '10px'
    };

    return (
      <div className="sidebar-component" style={{
    zIndex: 100,
    width: '200px',
    position: 'fixed',
    top: '0px',
    minHeight: '100%',
    height: '100%',
    WebkitTransition: 'all .3s ease-in-out',
    MozTransition: 'all .3s ease-in-out',
    OTransition: 'all .3s ease-in-out',
    transition: 'all .3s ease-in-out',
    background: '#213049'
      }}>
        <div className="logo" style={logoStyles}>
          <Link to="/">LOGO</Link>
        </div>
        <ul className="nav-menu">
          <li className="nav-menu-item" style={menuItemStyles}>
            <Link to="/basedocs" style={linkStyles}>
              <Glyphicon glyph="align-left" />
              <span className="nav-title" style={itemTitleStyles}>基础档案</span>
            </Link>
          </li>
          <li className="nav-menu-item" style={menuItemStyles}>
            <Link to="/role" style={linkStyles}>
              <Glyphicon glyph="align-left" />
              <span className="nav-title" style={itemTitleStyles}>角色配置</span>
            </Link>
          </li>
          <li className="nav-menu-item" style={menuItemStyles}>
            <Link to="/permission" style={linkStyles}>
              <Glyphicon glyph="align-left" />
              <span className="nav-title" style={itemTitleStyles}>权限配置</span>
            </Link>
          </li>
          <li className="nav-menu-item" style={menuItemStyles}>
            <Link to="/permission" style={linkStyles}>
              <Glyphicon glyph="align-left" />
              <span className="nav-title" style={itemTitleStyles}>权限分配</span>
            </Link>
          </li>
          <li className="nav-menu-item" style={menuItemStyles}>
            <Link to="/permission" style={linkStyles}>
              <Glyphicon glyph="align-left" />
              <span className="nav-title" style={itemTitleStyles}>权限配置应用注册</span>
            </Link>
          </li>
          <li className="nav-menu-item" style={menuItemStyles}>
            <Link to="/archsetting" style={linkStyles}>
              <Glyphicon glyph="align-left" />
              <span className="nav-title" style={itemTitleStyles}>基础档案配置</span>
            </Link>
          </li>
          <li className="nav-menu-item" style={menuItemStyles}>
            <Link to="/ncsync" style={linkStyles}>
              <Glyphicon glyph="align-left" />
              <span className="nav-title" style={itemTitleStyles}>NC同步配置功能</span>
            </Link>
          </li>
        </ul>
      </div>
    );
  }
};
