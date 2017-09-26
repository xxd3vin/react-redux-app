# 发布和部署

如果需要部署到测试服务器或者生产服务器，请首选使用Jenkins来统一进行部署。

## 如何升级版本号

升级版本号，比如升级到0.1.4

先修改`package.json`中的版本号

```
git add package.json
git commit -m 'new release'
git tag -a v0.1.4 -m 'new release'
git push --follow-tags
```

## 手动发布到测试服务器

由于[这个问题](https://trello.com/c/wDFRGQl8/12-172-20-13-230)以及[这个问题](https://trello.com/c/dhpJBvVg/11-4-19)，所以这里提供一个方式绕开，也就是从本地部署到测试服务器。注意请先准备好密钥对。

以下拿10.3.14.238这台测试服务器为例

```
npm run build:yzb
. ".jenkins/functions.sh"
#gen_config 'http' '10.3.14.238' '/ficloud'
ansible-playbook .playbook/gen_config.yaml
sync_files '10.3.14.238' '22' 'sscweb' 'dist/' \
  '/data/ficloud/uiresources/manaaccount'
```
