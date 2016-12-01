

const express = require('express');
const router = express.Router();
const track = require('../service/track');

// GET /tracks/search?query={query}&before={before}&count={count}
router.get('/search', (req, res) => {

    const before = parseInt(req.query.before) || Number.MAX_SAFE_INTEGER;
    const count = parseInt(req.query.count) || 10;
    const query = req.query.query;

    if(query === null || query === '') {

       res.status(412).json({});
       return;
   }

   track.findQueryAll(query, before, count)
        .then((data) => {

            res.status(200).json(data);
            return;
        })
        .catch((e) => {

            res.status(500).json({});
            return;
        });
});

// POST /tracks/:id/like
router.post('/:id/like', (req, res) => {

    const trackId = parseInt(req.params.id);
    const userId = parseInt(req.session.userId);

    if(trackId === null || trackId === '') {

       res.status(412).json({});
       return;
    }

    track.addLike(trackId, userId)
         .then((data) => {

             if(data === null) {

                 res.status(404).json({});
                 return;
             }

             res.status(204).json({});
             return;
         })
         .catch((e) => { res.status(500).json({}); return;});
});

// POST /tracks/:id/unlike
router.post('/:id/unlike', (req, res) => {

    const trackId = parseInt(req.params.id);
    const userId = req.session.userId;

    if(trackId === null || trackId === '') {

       res.status(412).json({});
       return;
    }

    track.deleteLike(trackId, userId)
         .then((data) => {

             if(data === null) {

                 res.status(404).json({});
                 return;
             }

             res.status(204).json({});
             return;
         })
         .catch((e) => { res.status(500).json({}); return; });

});

module.exports = router;
