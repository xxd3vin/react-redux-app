/**
 * tree 常用的helper function
 */

/**
 * 2) A clever exploit of the JSON library to deep-clone objects
 * http://heyjavascript.com/4-creative-ways-to-clone-objects/#
 */
export const deepCopy = old => JSON.parse(JSON.stringify(old));

/**
 * 遍历树，并判断树中指定名称的节点是否还有子节点
 * 如果children=[]也算作没有children
 */
export function hasChildren(treeData, key) {
  var has = false;
  const loop = nodes => {
    nodes.forEach(node => {
      if (node.key === key && node.children && node.children.length !== 0) {
        has = true;
        return;
      }
      if (node.children) {
        loop(node.children);
      }
    });
  };
  loop(treeData);
  return has;
}

/**
 * [helper] 遍历tree然后对没有child的节点设定为叶子节点
 * @param {Array} treeData 当前树的数据
 * @param {String} curKey 在该节点下添加了新的child
 * @param {Number} level 树
 */
export function setLeaf(treeData, curKey, level) {
  const loopLeaf = (data, lev) => {
    const l = lev - 1;
    data.forEach((item) => {
      if ((item.key.length > curKey.length) ? item.key.indexOf(curKey) !== 0 :
        curKey.indexOf(item.key) !== 0) {
        return;
      }
      if (item.children) {
        loopLeaf(item.children, l);
      } else if (l < 1) {
        item.isLeaf = true;
      }
    });
  };
  loopLeaf(treeData, level + 1);
}

/**
 * [helper] 基于现有的tree，在指定node添加child，创建出来新的tree
 * @param {Array} oldTreeData 没有插入新节点的树
 * @param {String} curKey 将数据添加到这个节点上
 * @param {Array} child 将这个数据添加到指定节点上
 * @param {Number} level 添加的级别，已废弃
 * @return {Array} 插入新节点之后生成的新树
 */
export function genNewTreeData(oldTreeData, curKey, child/* , level */) {
  var newTreeData = deepCopy(oldTreeData);
  const loop = (data) => {
    // if (level < 1 || curKey.length - 3 > level * 2) return;
    data.forEach((item) => {
      if (curKey === item.key) {
        item.children = child;
      } else {
        if (item.children) {
          loop(item.children);
        }
      }
    });
  };
  loop(newTreeData);
  //setLeaf(oldTreeData, curKey, level);
  return newTreeData;
}
