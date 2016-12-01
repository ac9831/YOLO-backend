'use strict';

const express = require('express');
const router = express.Router();
const user = require('../service/user');
const tag = require('../domain/entity/tag');

// GET /users/:id
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (id === null || id === '') {

        res.status(412).json({});
        return;
    }
    user.findById(id)
        .then((data) => {
            if (data === null) {

                res.status(404).json({});
                return;
            }
            res.status(200).json({ body : {
                'id': data.id,
                'nickname': data.name,
                'birth': data.birth,
                'gender': data.gender
            }});
            return;

        })
        .catch((e) => { res.status(500).json({}); return; });

});

// GET /users/:id/profile?redirect={redirect}  프로필 테스트 필요
// false 일때 테스트 필요
router.get('/:id/profile', (req, res) => {

    const id = parseInt(req.params.id);
    const redirect = (req.query.redirect === 'true') || false;

    if (id === null || id === '') {

        res.status(412).json({});
        return;
    }
        user.findById(id)
            .then((data) => {

                if (data === null) {

                    res.status(404).json({});
                    return;
                }

                if (redirect) {
                     res.redirect('https://s3.ap-northeast-2.amazonaws.com/' + data.profile);
                     return;
                }

                res.json({body : 'https://s3.ap-northeast-2.amazonaws.com/' + data.profile});
                return;
            })
            .catch((e) => { res.status(500).json({}); return; });

});

// GET /users/:id/tags
router.get('/:id/tags', (req, res) => {

    const id = parseInt(req.params.id);

    if (id === null || id === '') {
        res.status(412).json({});
        return;
    }
    user.getTrack(id)
        .then((data) => {

            if(data === null) {

                res.status(404).json({});
                return;
            }

            let ides = [];
            const tracks = data.tracks;

            for (let i = 0; i < tracks.length; i++) {
                ides.push(tracks[i].id);
            }

            if(tracks.length > 0) {

                user.getGenres(ides)
                    .spread((results) => {

                        ides = [];
                        for (let i = 0; i < results.length; i++) {
                            ides.push({
                                'id': results[i].tagId
                            });
                        }

                        if(results.length > 0) {

                            user.getTag(ides)
                                .then((data) => {

                                    res.status(200).json({body : data});
                                    return;
                                })
                                .catch((e) => {

                                    res.status(500).json({});
                                    return;
                                });
                            }else {

                                res.status(200).json(ides);
                                return;
                            }

                        })
                        .catch((e) => {

                            res.json(500);
                            return;

                        });

                    }else {

                        res.status(200).json(ides);
                        return;
                    }
                })
                .catch((e) => {

                    res.status(500).json({});
                    return;
                });

});

// DELETE /users/:id
router.delete('/:id', (req, res) => {

    const id = parseInt(req.params.id);

    if (id === null || id === '') {

        res.status(412).json({});
        return;
    }

        user.destroy(id)
            .then((data) => {

                if (data === '' || data === null) {

                    res.status(404).json({});
                    return;
                }

                res.status(204).json({});
                return;

            });

});

module.exports = router;
