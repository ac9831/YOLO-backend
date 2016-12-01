"use strict"

const express = require('express');
const router = express.Router();
const artistdb = require('../domain/entity/artist');
const artist = require('../service/artist');
const fiesta = require('../service/fiesta');
const track = require('../service/track')


// GET /search?query={query}&type={type}&before={before}&count={count}
router.get('/', (req, res) => {

    const type = req.query.type || all;
    const query = req.query.query;
    const before = parseInt(req.query.before) || Number.MAX_SAFE_INTEGER;
    const count = parseInt(req.query.count) || 10;
    const userId = req.session.userId || 2;

    if(query === null || query === '') {

       res.status(412).json({});
       return;
    }

    switch (type) {

        case ('fiesta') :
            fiesta.findQueryAll(query, before, count)
                  .then((data) => { res.status(200).json({body : data}); })
                  .catch((e) => { res.status(500).json({}); return; })
            break;

        case ('artist') :

            artist.findQueryAll(query, before, count)
                  .then((data) => { res.status(200).json({body : data}); })
                  .catch((e) => { res.status(500).json({}); return; })

            break;

        case ('track') :
            track.findQueryAll(query, before, count)
                  .then((data) => { res.status(200).json({body : data}); })
                  .catch((e) => { res.status(500).json({}); return; })
            break;

        case ('all'):
            Promise.all([
                fiesta.findQueryAll(query, before, count),
                artist.findQueryAll(query, before, count),
                 track.findQueryAll(query, before, count)
                    ]).then((data) => {
                        const ret = {body : {
                            artists : data[0],
                            fiesta : data[1],
                            tracks : data[2]
                        }};
                        for(let i=0;i<data[2].length;i++){
                            (function(i){
                                track.findLike(data[2][i].dataValues.id, userId)
                                     .then((likeData) => {
                                         console.log(likeData);

                                         if(likeData.length < 1) {
                                             ret.body.tracks[i].dataValues.like = false;
                                         }
                                         else {
                                             ret.body.tracks[i].dataValues.like = true;
                                         }

                                         if(i === data[2].length-1) {
                                             res.status(200).json(ret);
                                             return;
                                         }
                                     })
                                     .catch((e) => {console.log(e); res.status(500).json({}); });
                            })(i);
                        }

                    }).catch((e) => {console.log(e);res.status(500).json({}); return;})

            break;

        default :

            return;

    }

});

module.exports = router;
