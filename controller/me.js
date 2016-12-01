'use strict';

const express = require('express');
const router = express.Router();
const user = require('../service/user');
const tag = require('../domain/entity/tag');
const track = require('../service/track');
const fiesta = require('../service/fiesta');
const artist = require('../service/artist');

// GET /me/tracks?before=0&count=0
router.get('/tracks', (req, res) => {

    const id = parseInt(req.session.userId) || 2;
    const before = parseInt(req.query.before);
    const count = parseInt(req.query.count);

    if (id === null || id === '') {

        res.status(412).json({});
        return;
    }
    track.findAllLike(id)
         .then((data) => {
             if (data.length < 1) {

                 res.status(404).json({});
                 return;
             }
             let trackids = [];
             for(let i=0;i<data.length;i++) {
                 trackids.push(data[i].dataValues.trackId);
             }
             track.findTrackUserId(trackids, before, count)
                  .then((trackData) => {
                      res.status(200).json({ body : trackData});
                      return;
                  })
                  .catch((e) =>{
                      res.status(500).json({});
                      return;
                  });
        })
        .catch((e) => {res.status(500).json({}); return; });

});

// GET /me/fiesta?before=0&count=0
router.get('/fiesta', (req, res) => {
    const id = parseInt(req.session.userId) || 2;
    const before = parseInt(req.query.before);
    const count = parseInt(req.query.count);

    if (id === null || id === '') {

        res.status(412).json({});
        return;
    }
    fiesta.findInterUserId(id)
          .then((data) => {
              if (data.length < 1) {

                  res.status(404).json({});
                  return;
              }
              let fiestaids = [];
              for(let i=0;i<data.length;i++) {
                  fiestaids.push(data[i].dataValues.fiestaId);
              }
              fiesta.findFiestaUserId(fiestaids, before, count)
                  .then((fiestaData) => {
                      res.status(200).json({ body : fiestaData});
                      return;
                  })
                  .catch((e) =>{
                      console.log(e);
                      res.status(500).json({});
                      return;
                  });
        })
        .catch((e) => {console.log(e); res.status(500).json({}); return; });
});


// GET /users/{id}/artists?before=0&count=01
router.get('/artists', (req, res) => {
    const id = parseInt(req.session.userId) || 2;
    const before = parseInt(req.query.before);
    const count = parseInt(req.query.count);

    if (id === null || id === '') {

        res.status(412).json({});
        return;
    }
    artist.findInterUserId(id)
          .then((data) => {
              if (data.length < 1) {

                  res.status(404).json({});
                  return;
              }
              let artistids = [];
              for(let i=0;i<data.length;i++) {
                  artistids.push(data[i].dataValues.artistId);
              }
              console.log(artistids);
              artist.findArtistUserId(artistids, before, count)
                  .then((artistData) => {
                      res.status(200).json({ body : artistData});
                      return;
                  })
                  .catch((e) =>{
                      console.log(e);
                      res.status(500).json({});
                      return;
                  });
        })
        .catch((e) => {console.log(e); res.status(500).json({}); return; });
});



module.exports = router;
