/**
 * 配置后端服务器的IP和端口
 * 可以通过在生产环境中创建`config.js`文件，来覆盖这些配置。
 * config.js举例
 * ```
 * G_SCHEME = 'https';
 * G_HOST_PORT = 'fi2.yonyoucloud.com';
 * G_PATH_PREFIX = '/ficloud2';
 * ```
 */

const { NODE_ENV } = process.env;

const DEFAULT_SCHEME = NODE_ENV === 'production'
  ? 'https' // 默认使用友报账服务器，这也是ssc30-admin一开始就为了这个产品开发的
  : 'http'; // 默认使用本地开发环境，使用swagger作为后端，而且默认使用友报账后端
const DEFAULT_HOST_PORT = NODE_ENV === 'production'
  ? 'ybz.yonyoucloud.com'
  : '127.0.0.1:3009';
const DEFAULT_PATH_PREFIX = NODE_ENV === 'production'
  ? ''
  : '';

export const SCHEME = typeof G_SCHEME === 'undefined'
  ? DEFAULT_SCHEME
  : G_SCHEME;
export const HOST_PORT = typeof G_HOST_PORT === 'undefined'
  ? DEFAULT_HOST_PORT
  : G_HOST_PORT;
export const PATH_PREFIX = typeof G_PATH_PREFIX === 'undefined'
  ? DEFAULT_PATH_PREFIX
  : G_PATH_PREFIX;

// scheme:[//[user:password@]host[:port]][/]path[?query][#fragment]
const makeURL = path => `${SCHEME}://${HOST_PORT}${PATH_PREFIX}${path}`;

/**
 * 通用接口
 */

// 基础档案 模型查询接口
export const FICLOUDPUB_INITGRID_URL = makeURL('/ficloud_pub/initgrid');
// 基础档案 数据查询接口
export const getAddURL = type => `${SCHEME}://${HOST_PORT}${PATH_PREFIX}/${type}/add`;
export const getSaveURL = type => `${SCHEME}://${HOST_PORT}${PATH_PREFIX}/${type}/save`;
export const getDeleteURL = type => `${SCHEME}://${HOST_PORT}${PATH_PREFIX}/${type}/delete`;
export const getQueryURL = type => `${SCHEME}://${HOST_PORT}${PATH_PREFIX}/${type}/query`;
export const getEnableURL = type => `${SCHEME}://${HOST_PORT}${PATH_PREFIX}/${type}/turnenable`;
export const getUpdateURL = type => `${SCHEME}://${HOST_PORT}${PATH_PREFIX}/${type}/update`;

// 参照 查询接口
export const ReferDataURL = makeURL('/refbase_ctr/queryRefJSON');
export const ReferUserDataURL = makeURL('/userCenter/queryUserAndDeptByDeptPk');

// 公式编辑器
export const FormulaURL = makeURL('/echart/metatree');

/**
 * 转换规则模型
 */

export const MAPPING_DEF_QUERY_URL = makeURL('/mappingdef/query');
export const MAPPING_DEF_SAVE_URL = makeURL('/mappingdef/save');
export const MAPPING_DEF_DELETE_URL = makeURL('/mappingdef/delete');

/**
 * 实体映射模型 exchanger/entitymap.md
 */

// 左树查询服务
// export const OUTER_ENTITY_TREE_URL = makeURL('/template/tree');
export const OUTER_ENTITY_TREE_URL = makeURL('/outerentitytree/querymdtree');
// 左树节点查询服务
// export const OUTER_ENTITY_TREE_NODE_CHILDREN_URL = makeURL('/template/node');
// 右表查询服务
export const OUTER_ENTITY_TREE_NODE_DATA_URL = makeURL('/outerentitytree/querynodedata');
export const OUTER_ENTITY_TREE_ADD_NODE_DATA_URL = makeURL('/outerentitytree/addnodedata');
export const OUTER_ENTITY_TREE_UPDATE_NODE_DATA_URL = makeURL('/outerentitytree/updatenodedata');
export const OUTER_ENTITY_TREE_DEL_NODE_DATA_URL = makeURL('/outerentitytree/delnodedata');
