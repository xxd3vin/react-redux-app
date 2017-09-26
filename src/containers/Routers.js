import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import App from './App';
import NoMatch from '../components/NoMatch';
import Welcome from './Welcome';

import ArchContainer from './BaseDoc/ArchContainer'; // 基础档案
import AccountingSubject from './AccountingSubject'; // 会计平台科目
import BaseDocIndex from './BaseDoc/BaseDocIndex'; // 基础档案列表页面
import AccSubIndex from './AccSubIndex'; // 会计平台列表页面
// 转换规则定义
import MappingDef from './MappingDef';
import MappingDef2 from './MappingDef2';
import MappingDef2CreateForm from './MappingDef2CreateForm';
import MappingDef2EditForm from './MappingDef2EditForm';
import ExternalDataModelling from './ExternalDataModelling'; // 外部数据建模
import Entity from './Entity'; // 实体模型
import EntityMap from './EntityMap'; // 实体映射

/** 2016年做的，不知道以后是否还有用 */
import RoleContainer from './RoleContainer'; // 角色配置
import PermissionPage from './PermissionPage'; // 权限配置/权限分配
import ArchSettingPage from './ArchSettingPage'; // 基础档案配置
import NCSyncPage from './NCSyncPage'; // NC同步配置功能

// Demo
import DemoFormContainer from './DemoFormContainer';
import DemoTreeContainer from './DemoTreeContainer';

/**
 * "You cannot change <Router routes>; it will be ignored", when hot-loading
 * https://github.com/reactjs/react-router-redux/issues/179#issuecomment-241771171
 */
const Routers = (
  <Router history={hashHistory}>
    <Route path="/" component={Welcome} />
    <Route path="/app" component={App}>
      <IndexRoute component={Welcome} />
      <Route path="/welcome" component={Welcome} />
      <Route path="/basedocs" component={BaseDocIndex}>
        <Route path="/basedoc/:baseDocId" component={ArchContainer} />
      </Route>
      <Route path="/accsubs" component={AccSubIndex}>
        <Route path="/accsub/:baseDocId" component={AccountingSubject} />
      </Route>
      <Route path="/role" component={RoleContainer} />
      <Route path="/permission" component={PermissionPage} />
      <Route path="/archsetting" component={ArchSettingPage} />
      <Route path="/ncsync" component={NCSyncPage} />
      <Route path="/demo/form" component={DemoFormContainer} />
      <Route path="/demo/tree" component={DemoTreeContainer} />
      <Route path="*" component={NoMatch} />
    </Route>
    <Route path="/basedocs-no-sidebar" component={BaseDocIndex}>
      <Route path="/basedocs-no-sidebar/basedoc/:baseDocId" component={ArchContainer} />
    </Route>
    <Route path="/accsubs-no-sidebar" component={AccSubIndex}>
      <Route path="/accsubs-no-sidebar/accsub/:baseDocId" component={AccountingSubject} />
    </Route>
    <Route path="/basedocs-no-sidebar-single-page/basedoc/:baseDocId" component={ArchContainer} />
    <Route path="/external-data-modelling-no-sidebar-single-page/:billTypeCode" component={ExternalDataModelling} />
    <Route path="/entity-no-sidebar-single-page" component={Entity} />
    <Route
      path="/entity-map-no-sidebar-single-page/:billTypeCode/:mappingDefId"
      component={EntityMap}
    />
    <Route
      path="/mapping-def-no-sidebar-single-page"
      component={MappingDef}
    />
    <Route
      path="/mapping-def"
      component={MappingDef}
    />
    <Route
      path="/mapping-def2"
      component={MappingDef2}
    />
    <Route
      path="/mapping-def2/create"
      component={MappingDef2CreateForm}
    />
    <Route
      path="/mapping-def2/:id"
      component={MappingDef2EditForm}
    />
  </Router>
);

module.exports = Routers;
