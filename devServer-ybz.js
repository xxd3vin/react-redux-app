/* eslint-disable no-console, no-process-exit */

const path = require('path');
const moment = require('moment');

// HTTP server for local development
const compression = require('compression');
const express = require('express');
const bodyParser = require('body-parser');
// const multer = require('multer'); // for multipart/form-data

// Webpack for local development
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

// Webpack config for local development
const config = require('./webpack.config.dev.ybz');

// Create a Express server, enable middlewares
const app = express();
app.use(compression());
// 反向代理中间件需要在body-parser之前处理请求，否则会导致请求hang up
app.use(require('./server/routes/aliyun')());
// Parsing content-type: application/json
app.use(bodyParser.json());
// Parsing content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// Parsing content-type: multipart/form-data
// var upload = multer();

const compiler = webpack(config);
app.use(webpackMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));
app.use(webpackHotMiddleware(compiler));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dev-ybz.html'));
});
app.use('/', express.static(path.join(__dirname, 'client')));

app.use(require('./server/routes/fakeApiArch')());
app.use(require('./server/routes/fakeApiRole')());
app.use(require('./server/routes/fakeApiPermission')());
app.use(require('./server/routes/fakeApiArchSetting')());
app.use(require('./server/routes/fakeApiNCSync')());

const port = process.env.PORT || 3008;
const ip = process.env.IP || '0.0.0.0';

app.listen(port, ip, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://%s:%s', ip, port);
  console.log(moment().format('YYYY-MM-DD HH:mm:SS'), 'webpack is building now, please wait...');
});
