'use strict';

const express = require('express');
const router = express.Router();
const track = require('../../service/track');


// POST /admin/tracks
router.post('/', (req, res) => {

    const title = req.body.title;
    const genres = JSON.parse(req.body.genres);
    const artists = JSON.parse(req.body.artists);
    const rank = req.body.rank;
    const link = req.body.link;
    const dropAt = req.body.dropAt;
    const release = req.body.release;

    if (title === null || title === '' || genres === null || genres === '' || artists === null || artists === '' || rank === null
        || rank === '' || link === null || link === '' ||dropAt === null || dropAt === '') {

        res.status(412).json({});
        return;
    }

    track.addTrack(title, rank, link, dropAt, release)
         .then((tracks) => {

             const addGenre = function(){
                 return new Promise((resolve, reject) => {

                             const genreRet = [];

                             for(let i=0; i<genres.length; i++) {
                                 track.addGenre(tracks.id, genres[i].genreId)
                                      .then((genre) => {

                                          genreRet.push(genre.tagId);
                                          if(i === genres.length-1) {
                                              resolve(genreRet);
                                          }
                                      })
                                      .catch((e) => {

                                          reject(e);
                                          return;
                                      });
                             }

                        });
             }

             const addCompose = function(){
                 return new Promise((resolve, reject) => {
                             const artistRet = [];

                             for(let i=0; i<artists.length; i++) {
                                 track.addCompose(tracks.id, artists[i].artistId)
                                      .then((compose) => {

                                          artistRet.push(compose.artistId);
                                          if(i === artists.length-1) {
                                              resolve(artistRet);
                                          }
                                      })
                                      .catch((e) => {

                                          reject(e);
                                          return;
                                      });
                            }
                        });
             }

             Promise.all([
                 addGenre(genres, track),
                 addCompose(artists, track)
             ])
             .then((value) => {
                 tracks.dataValues.artists = value[0];
                 tracks.dataValues.genres = value[1];

                 res.status(201).json(tracks);
                 return;
             })
             .catch(() =>{

                 res.status(500).json({});
                 return;
             });


         })
         .catch(() => {

             res.status(500).json({});
             return;
         });
});

router.post('/:id/genres', (req, res) => {

    const trackId = parseInt(req.params.id);
    const genreId = parseInt(req.body.genreId);

    if(trackId === null || trackId === '' || genreId === null || genreId === '') {

        res.status(412).json({});
        return;
    }

    track.addGenre(trackId, genreId)
         .then((data) => {

             res.status(201).json(data);
             return;
         })
         .catch(() => {

            res.status(500).json({});
            return;
         });

});

router.delete('/:trackId/genres/:genreId', (req, res) => {

    const trackId = parseInt(req.params.trackId);
    const genreId = parseInt(req.params.genreId);

    if(trackId === null || trackId === '' || genreId === null || genreId === '') {
        res.status(412).json({});
        return;
    }

    track.deleteGenre(trackId, genreId)
         .then(() => {

             res.status(204).json({});
             return;
         })
         .catch((e) => {
             console.log(e);
             res.status(500).json({});
             return;
         });

});

router.post('/:id/artists', (req, res) => {

    const trackId = parseInt(req.params.id);
    const artistId = parseInt(req.body.artistId);

    if(trackId === null || trackId === '' || artistId === null || artistId === '') {

        res.status(412).json({});
        return;
    }

    track.addCompose(trackId, artistId)
         .then((data) => {

             res.status(201).json(data);
             return;
         })
         .catch(() => {

             res.status(500).json({});
             return;
         });

});

router.delete('/:trackId/artists/:artistId', (req, res) => {

    const trackId = parseInt(req.params.trackId);
    const artistId = parseInt(req.params.artistId);

    if(trackId === null || trackId === '' || artistId === null || artistId === '') {

        res.status(412).json({});
        return;
    }

    track.deleteCompose(trackId, artistId)
         .then(() => {

             res.status(204).json({});
             return;
         })
         .catch(() => {

             res.status(500).json({});
             return;
         });

});

module.exports = router;
