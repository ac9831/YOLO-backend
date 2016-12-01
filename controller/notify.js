"use strict"

const express = require('express');
const router = express.Router();
const notify = require('../service/notify');

// GET /notifications?before={before}&count={count}
router.get('/', (req, res) => {

    const before = parseInt(req.query.before) || Number.MAX ;
    const count = parseInt(req.query.count) || 10;
    notify.findAll(before, count)
          .then((data) => {
              for(let i=0;i<data.length;i++){

                  data[i].dataValues.read = data[i].notify_records[0].dataValues.read;
                  delete data[i].dataValues.notify_records;
                  if(i === data.length-1){
                       res.status(200).json({body : data});
                  }
              }
          })
          .catch((e) => { console.log(e);res.status(500).json({}); return; });

});

// PUT /notifications/:id/read
router.put('/:id/read', (req, res) => {

    const id = parseInt(req.params.id);
    const userId = req.body.userId || 2;

    if(id === null || id === '') {

       res.status(412).json({});
       return;
    }
    notify.addRead(id, userId)
          .then((data) => {
              if(data === null) {

                  res.status(404).json({});
                  return;
              }
              res.status(204).json({});
          })
          .catch((e) => {console.log(e);res.status(500).json({}); return; });

});

module.exports = router;
