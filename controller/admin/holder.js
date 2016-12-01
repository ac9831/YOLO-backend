"use strict"

const express = require('express');
const router = express.Router();

const fiesta = require('../../service/fiesta');
const holder = require('../../service/holder');

router.post('/', (req, res) => {

    const name = req.body.name;

    if (name === null || name === '') {

        res.status(412).json({});
        return;
    }

    holder.addHolders(name)
          .then((data) => {

              res.status(204).json(data);
              return;
          })
          .catch((e) => {

              res.status(500).json({});
              return;
          });

});

router.put('/:id', (req, res) => {

    const id = parseInt(req.params.id);
    const name = req.body.name;

    if (name === null || name === '' || id === null || id === 0) {

        res.status(412).json({});
        return;
    }

    holder.modifyHolders(id, name)
          .then((data) => {

              if (data === null) {

                  res.status(404).json({});
                  return;
              }
              else {

                  res.status(200).json(data);
                  return;
              }
          })
          .catch((e) => {

              res.status(500).json({});
              return;
          });
});

router.delete('/:id', (req, res) => {

    const id = parseInt(req.params.id);

    if (id === null || id === 0) {

        res.status(412).json({});
        return;
    }

    holder.deleteHolders(id)
          .then((data) => {

              if (data === null) {

                  res.status(404).json({});
                  return;
              }

              res.status(204).json({});
              return;
          })
          .catch((e) => {

              res.status(500).json({});
              return;
          });
});

module.exports = router;
