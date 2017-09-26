import { combineReducers } from 'redux';

import arch from './arch'; // 基础档案
import accountingSubject from './accountingSubject'; // 基础档案
import mappingDef from './mappingDef'; // 转换规则定义
import entity from './entity'; // 实体模型
import externalDataModelling from './externalDataModelling'; // 外部数据建模
import entityMap from './entityMap'; // 实体映射
import welcome from './welcome'; // 调试用首页

// 之前的代码，不知道是否还有用
import { role } from './role';
import permission from './permission';
import archSetting from './archSetting';
import ncSync from './ncSync';
import demo from './demo';

const rootReducer = combineReducers({
  arch,
  accountingSubject,
  mappingDef,
  entity,
  externalDataModelling,
  entityMap,
  welcome,

  role,
  permission,
  archSetting,
  ncSync,
  demo
});

export default rootReducer;
