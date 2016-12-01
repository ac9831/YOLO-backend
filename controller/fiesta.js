"use strict"

const express = require('express');
const router = express.Router();
const fiesta = require('../service/fiesta');
const tag = require('../domain/entity/tag');

// GET /fiesta?before={before}&count={count}
router.get('/', (req, res) => {
    const before = parseInt(req.query.before) || Number.MAX_SAFE_INTEGER;
    const count = parseInt(req.query.count) || 10;

    fiesta.findAll(before, count)
          .then((data) => { res.status(200).json({body : data}); return; })
          .catch((e) => { res.status(500).json({}); return; });

});

// GET /fiesta/search?query={query}&before={before}&count={count}
router.get('/search', (req, res) => {

    const query = req.query.query;
    const before = parseInt(req.query.before) || Number.MAX_SAFE_INTEGER;
    const count = parseInt(req.query.count) || 10;

    if(query === null || query === '') {

       res.status(412).json({});
       return;
    }
    fiesta.findQueryAll(query, before, count)
          .then((data) => { res.status(200).json({body : data}); return; })
          .catch((e) => { res.status(500).json({}); return; });

});

// GET /fiesta/:id
router.get('/:id', (req, res) => {

    const id = parseInt(req.params.id);

    if(id === null || id === 0) {

       res.status(412).json({});
       return;
    }

    Promise.all([
        fiesta.findById(id),
        fiesta.findPhotos(id),
        fiesta.findPerform(id)
            ]).then((data) => {
                if(data === null) {

                    res.status(404).json({});
                    return;
                }
                data[1].path = 'https://s3.ap-northeast-2.amazonaws.com/' + data[1].path;
                data[0].dataValues.photos = data[1];
                data[0].dataValues.performs = data[2];
                res.json({body : data[0]});
                return;
            }).catch((e) => { console.log(e); return; });

});

// GET /fiesta/:id/purchase
router.get('/:id/purchase', (req, res) => {

    const id = parseInt(req.params.id);

    if(id === null || id === '') {

       res.status(412).json({});
       return;
    }

    fiesta.findPurchase(id)
          .then((data) => { res.status(200).json({body : data.link}); return; })
          .catch(() => { res.status(500).json({}); return; });

});

// GET /fiesta/:id/facade?redirect={redirect}
router.get('/:id/facade', (req, res) => {

    const id = parseInt(req.params.id);

    if(id === null || id === '') {

       res.status(412).json({});
       return;
    }

    fiesta.findById(id)
          .then((data) => {
              if(data === null) {

                  res.status(404).json({});
                  return;
              }
              res.status(200).json({body : 'https://s3.ap-northeast-2.amazonaws.com/' + data.facade}); return; })
              .catch(() => { res.status(500).json({}); return; });

});

// GET /fiesta/:id/artists?before={before}&count={count}
router.get('/:id/artists', (req, res) => {

    const id = parseInt(req.params.id);
    const before = parseInt(req.query.before) || Number.MAX_SAFE_INTEGER;
    const count = parseInt(req.query.count) || 10;

    if(id === null || id === '') {

       res.status(412).json({});
       return;
    }

    fiesta.findHeadlinerArtists(id, before, count)
          .then((data) => {
              if(data === null) {

                  res.status(404).json({});
                  return;
              }

              const ret = {body : []};
              for(let i=0;i<data.length;i++){
                  ret.body.push(data[i].artists[0]);
              }
              res.status(200).json(ret); return;
          })
          .catch(() => { res.status(500).json({}); return; });

});

// GET /fiesta/:id/react?status={status}
router.get('/:id/react', (req, res) => {

    const id = parseInt(req.params.id);
    const status = req.query.status;
    const userId = req.session.userId || 2;

    if(id === null || id === '') {

       res.status(412).json({});
       return;
    }

    fiesta.findInterest(id)
          .then((data) => {
              console.log(data);
              if(data.length < 1) {
                  fiesta.createInterest(id, userId, status)
                        .then((data) => {
                            res.status(200).json({});
                            return;
                        })
                        .catch(() => { res.json(500); return; });

              }
              else {
                  fiesta.findUserStatus(id,status)
                        .then((data) => {
                            if(data === null) {

                                res.status(404).json({});
                                return;
                            }
                            res.status(204).json({}); return; })
                            .catch(() => { res.json(500); return; });
              }
          })
          .catch((e) => {
              console.log(e);
          })


});


module.exports = router;
