'use strict';

const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const artistdb = require('../domain/entity/artist');
const artist = require('../service/artist');

// GET /artists?before={before}&count={count}
router.get('/', (req, res) => {

    const before = parseInt(req.query.before) || Number.MAX ;
    const count = parseInt(req.query.count) || 20;

    artist.findAll(before, count)
          .then((data) => { res.status(200).json({body : data}); })
          .catch((e) => { res.status(500).json({}); return; });

});

// GET /artists/search?query={query}&before={before}&count={count}
router.get('/search', (req, res) => {

    const query = req.query.query;
    const before = parseInt(req.query.before) || Number.MAX;
    const count = parseInt(req.query.count) || 10;

    if(query === null || query ===' ') {

        res.status(412).json({});
        return;
    }

    artist.findQueryAll(query, before, count)
          .then((data) => { res.status(200).json({body : data});})
          .catch((e) => { res.status(500).json({}); return;});

});

// GET /artists/:id
router.get('/:id', (req, res) => {

    const artistId = parseInt(req.params.id);

    if(artistId === null || artistId === ' ') {

       res.status(412).json({});
       return;
    }

    artist.findDetail(artistId)
          .then((data) => {
              if(data === null) {

                  res.status(404).json({});
                  return;
              }
              res.status(200).json({body : data});
             })
          .catch((e) => { res.status(500).json({}); return; });

});

// GET /artists/:id/profile
router.get('/:id/profile', (req, res) => {

    const id = parseInt(req.params.id);

    if (id === null || id === '') {

        res.status(412).json({});
        return;
    }

    artist.findProfile(id)
          .then((data) => {
              if (data === null) { res.status(404).json({}); return;}
              res.status(200).json({ body :{
                  id : id, profile : 'https://s3.ap-northeast-2.amazonaws.com/' + data.profile
              }});
          })
          .catch((e) => { res.status(500).json({}); return;});
});

// GET /artists/:id/tracks?before={before}&count={count}
router.get('/:id/tracks', (req, res) => {

    const id = parseInt(req.params.id);
    const before = parseInt(req.query.before);
    const count = parseInt(req.query.count);

    if(id === null || id === '') {

       res.status(412).json({});
       return;
    }

    artist.findArtistTrack(id, before, count)
          .then((data) => {

              if(data[0] === null || data[0] === undefined) {

                  res.status(404).json({});
                  return;
              }

              const body = {body: []};

              for(let i=0;i<data[0].tracks.length;i++){

                  body.body.push({
                      "id" : data[0].tracks[i].id,
                      "rank" : data[0].tracks[i].rank,
                      "title" : data[0].tracks[i].title,
                      "link" : data[0].tracks[i].link,
                      "genres" : {}
                  });

                  for(let j=0;j<data[0].tracks[i].tag_genres.length;j++){
                      body.body[0].genres = (data[0].tracks[i].tag_genres[j].tags);
                  }
              }
              res.status(200).json(body);
          })
          .catch((e) => {console.log(e); res.status(500).json({}); return; });

});

// POST /artists/:id/like
router.post('/:id/like', (req, res) => {

    const id = parseInt(req.params.id);
    const userId = req.session.userId;

    if(id === null || id === '') {

       res.status(412).json({});
       return;
    }

    artist.addLike(id, userId)
          .then((data) => {
              if(data === null) {
                  res.status(404).json({});
                  return;
              }
              res.status(204).json({});
          })
          .catch((e) => { res.status(500).json({}); return; });

});

// POST /artists/:id/unlike
router.post('/:id/unlike', (req, res) => {

    const artistId = parseInt(req.params.id);
    const userId = req.session.userId;

    if(artistId === null || artistId === '') {

       res.status(412).json({});
       return;
    }

    artist.deleteLike(artistId, userId)
          .then((data) => {
              if(data === null) {
                  res.status(404).json({});
                  return;
              }
              res.status(204).json({});
          })
          .catch((e) => { res.status(500).json({}); return; });

});

module.exports = router;
