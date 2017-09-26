/* jslint node:true */

const express = require('express');

const router = express.Router();

module.exports = function () {
  router.get('/api/table', (req, res) => {
    // const startIndex = req.query.startIndex;
    // const itemsPerPage = req.query.itemsPerPage;
    res.json({});
  });

  router.post('/api/table/head', (req, res) => {
    res.json({
      success: true,
      data: [
        {
          id: 'id',
          lable: '主键',
          datatype: 0,
        },
        {
          id: 'name',
          lable: '名称',
          datatype: 0,
        },
      ]
    });
  });

  router.post('/api/table/body', (req, res) => {
    res.json({
      success: true,
      data: [
        {
          id: '0DFF5E92-4174-4DB2-9744-CBE14A588D29',
          name: 'foo'
        },
        {
          id: '0DFF5E92-4174-4DB2-9744-CBE14A588D39',
          name: 'bar'
        },
      ]
    });
  });

  router.put('/api/table/:id', (req, res) => {
    const id = req.params.id;
    if (id !== '1') {
      res.json({
        data: {
          id,
          requestBody: req.body
        }
      });
    } else {
      res.json({
        error: {
          code: 123,
          message: '演示错误例子，错误代码123'
        }
      });
    }
  });

  router.delete('/api/table/:ids', (req, res) => {
    const ids = req.params.ids;
    res.json({
      data: {
        ids
      }
    });
  });

  return router;
};

