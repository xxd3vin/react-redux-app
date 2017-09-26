/**
 * 调试首页
 */

import React from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as WelcomeActions from '../actions/welcome';

class Welcome extends React.Component {

  componentWillMount() {
  }

  render() {
    const link = (path, name) => (
      <Link to={path}>{name}</Link>
    );
    const listLink = (path, name) => (
      <li>{link(path, name)}</li>
    );
    const kuaijipingtai = [
      { path: '/external-data-modelling-no-sidebar-single-page',
        name: '外部数据建模 ExternalDataModelling (no-sidebar, single-page)' },
      { path: '/entity-no-sidebar-single-page',
        name: '实体模型 Entity (no-sidebar, single-page)' },
      { path: '/mapping-def',
        name: '【废弃】转换规则定义 MappingDef (平台接入配置)' },
      { path: '/mapping-def2',
        name: '【废弃】转换规则定义2代 MappingDef2' }
    ];
    return (
      <div className="welcome-container">
        <div>
          <h2>基础档案</h2>
          <ul>
            {listLink('/basedocs', '所有基础档案类型')}
            {listLink('/basedocs-no-sidebar', '所有基础档案类型(no-sidebar)')}
            {listLink('/basedocs-no-sidebar-single-page/basedoc/dept', '基础档案 - 部门(no-sidebar, single-page)')}
          </ul>
        </div>
        <div>
          <h2>友账表 - 会计平台</h2>
          <ul>
            {kuaijipingtai.map(item => (
              <li key={item.path}>
                <Link to={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <ul>
            <li>
              <Link to="/accsubs-no-sidebar">
                会计平台科目
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

// 影射Store的State到App的Props, 这里用做数据
function mapStateToProps(state) {
  return state.welcome;
}

// 影射Store的dispath到App的Props,这里用做操作(事件)
function mapDispatchToProps(dispatch) {
  return bindActionCreators(WelcomeActions, dispatch);
}

// 练接是中间组件react-redux功能,用于把React的Props, State, Event和Redux的关联
export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
