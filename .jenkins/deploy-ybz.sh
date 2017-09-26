#!/bin/bash -ex

# 友报账

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
npm run build:ybz

# 官网
gen_config 'https' 'ybz.yonyoucloud.com' ''
sync_files '10.3.14.233' '22' 'sscweb' 'dist/' \
  '/server/tomcat_ssc/webapps/manaaccount'

# 5088 以后的测试环境
gen_config 'http' '172.20.4.88:5088' ''
sync_files '172.20.4.88' '22' 'root' 'dist/' \
  '/ssc/tomcat_dc_integration_2/webapps/manaaccount/'

# 6088
gen_config 'http' '172.20.4.88:6088' ''
sync_files '172.20.4.88' '22' 'root' 'dist/' \
  '/ssc/tomcat_dc_integration_3/tomcat_dc_integration/webapps/manaaccount'

# 234 鬼知道这是啥环境
gen_config 'http' '10.3.14.234' ''
sync_files '10.3.14.234' '22' 'sscweb' 'dist/' \
  '/server/tomcat_integration/webapps/manaaccount'

date
