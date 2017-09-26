// 由于后端没有接口，所以将基础档案类型数据暂时放在这里
// 除了提供前端页面引用这个数据，还提供给node后端（swagger mock controller）
// 使用。

module.exports = function getBaseDocTypes() {
  return [
    {id: 'accbook', name: '账簿'}
    ,{id: 'accelement', name: '会计要素'}
    ,{id: 'accperiod', name: '会计期间'}
    ,{id: 'accperiodscheme', name: '会计期间方案'}
    ,{id: 'accstandard', name: '会计准则'}
    ,{id: 'accsubjectchart', name: '账簿科目表'}
    ,{id: 'bank', name: '银行'}
    ,{id: 'bankaccount', name: '银行账户'}
    ,{id: 'bankclass', name: '银行类别'}
    ,{id: 'currency', name: '币种'}
    ,{id: 'dept', name: '部门'}
    ,{id: 'feeitem', name: '费用项目'}
    ,{id: 'feeitemclass', name: '费用项目类型'}
    ,{id: 'measuredoc', name: '数量'}
    ,{id: 'multidimension', name: '科目多维结构'}
    ,{id: 'project', name: '项目'}
    ,{id: 'projectclass', name: '项目类型'}
    ,{id: 'subjectchart', name: '科目表'}
    ,{id: 'user', name: '用户'}
    ,{id: 'valuerang', name: '值集'}
    ,{id: 'accsubject', name: '会计平台科目'}
  ];
}
