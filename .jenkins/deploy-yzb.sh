#!/bin/bash -ex

# 友账表

scripts_dir="$(dirname "$0")"
. "$scripts_dir/functions.sh"

echo DEBUG-start
pwd
set
echo DEBUG-end

## before_install:
export CHROME_BIN=google-chrome
export DISPLAY=:99.0

## install:
cnpm install

## script:
#npm test
npm run build:yzb

# 237 也就是 fi.yonyoucloud.com
echo "同步本地编译后的数据到友账表服务器 10.3.14.237(localhost)"
gen_config 'https' 'fi.yonyoucloud.com' '/ficloud'
rsync -arvzh --delete --progress --chmod=a+rwx dist/ \
  /data/ficloud/uiresources/manaaccount/

# 238
gen_config 'http' '10.3.14.238' '/ficloud'
sync_files '10.3.14.238' '22' 'sscweb' 'dist/' \
  '/data/ficloud/uiresources/manaaccount'

date
