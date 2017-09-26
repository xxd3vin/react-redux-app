/* eslint-disable no-console, no-process-exit */

const path = require('path');
const compression = require('compression');
const express = require('express');
const bodyParser = require('body-parser');
// const multer = require('multer');

const app = express();
app.use(compression());
// 反向代理中间件需要在body-parser之前处理请求，否则会导致请求hang up
app.use(require('./server/routes/aliyun')());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// var upload = multer(); // for parsing multipart/form-data

app.use('/swagger/basedoc.yaml',
  express.static(path.join(__dirname, 'src', 'swagger', 'basedoc.yaml')));
app.use('/', express.static(path.join(__dirname + '/dist')));

app.use(require('./server/routes/fakeApiArch')());
app.use(require('./server/routes/fakeApiRole')());
app.use(require('./server/routes/fakeApiPermission')());
app.use(require('./server/routes/fakeApiArchSetting')());
app.use(require('./server/routes/fakeApiNCSync')());

// Create a mock API with swagger

const SwaggerExpress = require('swagger-express-mw');

const swaggerConfig = {
  // Runner props
  // swagger: 'src/swagger/swagger.yaml', // 全部API
  swagger: 'src/swagger/basedoc.yaml', // 仅有基础档案API
  // config props
  appRoot: __dirname,  // required config
  configDir: 'src/swagger', // TODO: should move to src/api/swagger
  mockControllersDirs: 'src/api/mocks' // TODO: config not work for swagger-node-runner
};

SwaggerExpress.create(swaggerConfig, (err, swaggerExpress) => {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);
});

const port = process.env.PORT || 3008;
const ip = process.env.IP || '127.0.0.1';

app.listen(port, ip, err => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://%s:%s', ip, port);
});
