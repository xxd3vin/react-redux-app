/*jslint node:true */

'use strict';

const express = require('express');
const httpProxy = require('http-proxy');
const router = express.Router();
const proxy = httpProxy.createProxyServer();

const aliyunIP = '59.110.123.20';
const aliyunIP2 = '10.3.14.237';
//const aliyunIP = '127.0.0.1:8000';

module.exports = function () {
  var aliyunBackend = {
    target: `http://${aliyunIP2}`
  };
  router.all("/ficloud/*", function(req, res) {
    console.log('redirecting to aliyun');
    proxy.web(req, res, aliyunBackend);
  });
  return router;
};


