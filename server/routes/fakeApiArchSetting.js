/*jslint node:true */

'use strict';

const express = require('express');
const router = express.Router();

module.exports = function () {

  router.get('/api/archsetting/config', function (req, res) {
    res.json({
      props: 'some props',
      root: {
        id: '0',
        name: '(only one) root node',
        children: {
          0: {
            id: '0-0',
            name: 'node 3'
          },
          1: {
            id: '0-1',
            name: 'node 4'
          },
          2: {
            id: '0-2',
            name: 'node 5',
            children: {
              0: {
                id: '0-2-0',
                name: 'node 7'
              }
            }
          },
          3: {
            id: '0-3',
            name: 'node 6'
          }
        }
      }
    });
  });

  router.get('/api/archsetting', function (req, res) {
    const startIndex = req.query.startIndex;
    const itemsPerPage = req.query.itemsPerPage;
    var items = [];
    var json = {
      apiVersion: "1.0",
      data: {
        "currentItemCount": 5,
        "itemsPerPage": 5,
        "startIndex": 1,
        "totalItems": 22
      }
    };
  
    switch(startIndex) {
      case '1':
        res.json({
          apiVersion: "1.0",
          data: {
            "currentItemCount": 5,
            "startIndex": 1,
            "totalItems": 22,
            "items": [
              {
                id: 0,
                col1: 'row1, col1',
                col2: 'row1, col2',
                col3: 'row1, col3',
                cols: [
                  { type: 'text', label: 'id', value: '0' },
                  { type: 'text', label: 'col1', value: 'row1, col1' },
                  { type: 'text', label: 'col2', value: 'row1, col2' },
                  { type: 'text', label: 'col3', value: 'row1, col3' },
                  { type: 'text', label: 'col4', value: 'row1, col4' },
                  { type: 'text', label: 'col5', value: 'row1, col5' }
                ]
              },
              {
                id: 1,
                col1: 'row2, col1',
                col2: 'row2, col2',
                col3: 'row2, col3',
                cols: [
                  { type: 'text', label: 'id', value: '1' },
                  { type: 'text', label: 'col1', value: 'row2, col1演示错误' },
                  { type: 'text', label: 'col2', value: 'row2, col2' },
                  { type: 'text', label: 'col3', value: 'row2, col3' },
                  { type: 'text', label: 'col4', value: 'row2, col4' },
                  { type: 'text', label: 'col5', value: 'row2, col5' }
                ]
              },
              { id: 2, col1: 'row3, col1', col2: 'row3, col2', col3: 'row3, col3', cols: [
                { type: 'text', label: 'id', value: '2' },
                { type: 'text', label: 'col1', value: 'row3, col1' },
                { type: 'text', label: 'col2', value: 'row3, col2' },
                { type: 'text', label: 'col3', value: 'row3, col3' },
                { type: 'text', label: 'col4', value: 'row3, col4' },
                { type: 'text', label: 'col5', value: 'row3, col5' }
              ]},
              { id: 3, col1: 'row4, col1', col2: 'row4, col2', col3: 'row4, col3', cols: [
                { type: 'text', label: 'id', value: '3' },
                { type: 'text', label: 'col1', value: 'row4, col1' },
                { type: 'text', label: 'col2', value: 'row4, col2' },
                { type: 'text', label: 'col3', value: 'row4, col3' },
                { type: 'text', label: 'col4', value: 'row4, col4' },
                { type: 'text', label: 'col5', value: 'row4, col5' }
              ]},
              { id: 4, col1: 'row5, col1', col2: 'row5, col2', col3: 'row5, col3', cols: [
                { type: 'text', label: 'id', value: '4' },
                { type: 'text', label: 'col1', value: 'row5, col1' },
                { type: 'text', label: 'col2', value: 'row5, col2' },
                { type: 'text', label: 'col3', value: 'row5, col3' },
                { type: 'text', label: 'col4', value: 'row5, col4' },
                { type: 'text', label: 'col5', value: 'row5, col5' }
              ]}
            ]
          }
        });
        break;
      case '6':
        res.json({
          apiVersion: "1.0",
          data: {
            "currentItemCount": 5,
            "startIndex": 6,
            "totalItems": 22,
            "items": [
              { id: 5, col1: 'row6,  col1', col2: 'row6,  col2', col3: 'row6,  col3' , cols: [
                { type: 'text', label: 'id', value: '5' },
                { type: 'text', label: 'col1', value: 'row6, col1' },
                { type: 'text', label: 'col2', value: 'row6, col2' },
                { type: 'text', label: 'col3', value: 'row6, col3' },
                { type: 'text', label: 'col4', value: 'row6, col4' },
                { type: 'text', label: 'col5', value: 'row6, col5' }
              ]},
              { id: 6, col1: 'row7,  col1', col2: 'row7,  col2', col3: 'row7,  col3' , cols: [
                { type: 'text', label: 'id', value: '6' },
                { type: 'text', label: 'col1', value: 'row7, col1' },
                { type: 'text', label: 'col2', value: 'row7, col2' },
                { type: 'text', label: 'col3', value: 'row7, col3' },
                { type: 'text', label: 'col4', value: 'row7, col4' },
                { type: 'text', label: 'col5', value: 'row7, col5' }
              ]},
              { id: 7, col1: 'row8,  col1', col2: 'row8,  col2', col3: 'row8,  col3' , cols: [
                { type: 'text', label: 'id', value: '7' },
                { type: 'text', label: 'col1', value: 'row8, col1' },
                { type: 'text', label: 'col2', value: 'row8, col2' },
                { type: 'text', label: 'col3', value: 'row8, col3' },
                { type: 'text', label: 'col4', value: 'row8, col4' },
                { type: 'text', label: 'col5', value: 'row8, col5' }
              ]},
              { id: 8, col1: 'row9,  col1', col2: 'row9,  col2', col3: 'row9,  col3' , cols: [
                { type: 'text', label: 'id', value: '8' },
                { type: 'text', label: 'col1', value: 'row9, col1' },
                { type: 'text', label: 'col2', value: 'row9, col2' },
                { type: 'text', label: 'col3', value: 'row9, col3' },
                { type: 'text', label: 'col4', value: 'row9, col4' },
                { type: 'text', label: 'col5', value: 'row9, col5' }
              ]},
              { id: 9, col1: 'row10, col1', col2: 'row10, col2', col3: 'row10, col3' , cols: [
                { type: 'text', label: 'id', value: '9' },
                { type: 'text', label: 'col1', value: 'row10, col1' },
                { type: 'text', label: 'col2', value: 'row10, col2' },
                { type: 'text', label: 'col3', value: 'row10, col3' },
                { type: 'text', label: 'col4', value: 'row10, col4' },
                { type: 'text', label: 'col5', value: 'row10, col5' }
              ]}
            ]
          }
        });
        break;
      case '11':
        res.json({
          apiVersion: "1.0",
          data: {
            "currentItemCount": 5,
            "startIndex": 11,
            "totalItems": 22,
            "items": [
              { id: 10, col1: 'col1', col2: 'col2', col3: 'col3' },
              { id: 11, col1: 'col1', col2: 'col2', col3: 'col3' },
              { id: 12, col1: 'col1', col2: 'col2', col3: 'col3' },
              { id: 13, col1: 'col1', col2: 'col2', col3: 'col3' },
              { id: 14, col1: 'col1', col2: 'col2', col3: 'col3' }
            ]
          }
        });
        break;
      case '16':
        res.json({
          apiVersion: "1.0",
          data: {
            "currentItemCount": 5,
            "startIndex": 16,
            "totalItems": 22,
            "items": [
              { id: 15, col1: 'col1', col2: 'col2', col3: 'col3' },
              { id: 16, col1: 'col1', col2: 'col2', col3: 'col3' },
              { id: 17, col1: 'col1', col2: 'col2', col3: 'col3' },
              { id: 18, col1: 'col1', col2: 'col2', col3: 'col3' },
              { id: 19, col1: 'col1', col2: 'col2', col3: 'col3' }
            ]
          }
        });
        break;
      case '21':
        res.json({
          apiVersion: "1.0",
          data: {
            "currentItemCount": 5,
            "startIndex": 21,
            "totalItems": 22,
            "items": [
              { id: 20, col1: 'col1', col2: 'col2', col3: 'col3' },
              { id: 21, col1: 'col1', col2: 'col2', col3: 'col3' }
            ]
          }
        });
        break;
      default:
        res.json({
          apiVersion: "1.0",
          data: {
            "currentItemCount": 5,
            "startIndex": 1,
            "totalItems": 22,
            "items": [
              { id: 0, col1: 'col1', col2: 'col2', col3: 'col3' },
              { id: 1, col1: 'col1', col2: 'col2', col3: 'col3' },
              { id: 2, col1: 'col1', col2: 'col2', col3: 'col3' },
              { id: 3, col1: 'col1', col2: 'col2', col3: 'col3' },
              { id: 4, col1: 'col1', col2: 'col2', col3: 'col3' }
            ]
          }
        });
        break;
    }
  
  });
  
  router.post('/api/archsetting', function (req, res) {
    if (1) {
      res.json({
        data: {
          id: 123,
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
  
  router.put('/api/archsetting/:id', function (req, res) {
    const id = req.params.id;
    if (id !== '1') {
      res.json({
        data: {
          id: id,
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
  
  router.delete('/api/archsetting/:ids', function (req, res) {
    const ids = req.params.ids
    res.json({
      data: {
        ids: ids
      }
    });
  });

  return router;
};


