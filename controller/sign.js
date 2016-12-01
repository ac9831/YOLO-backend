"use strict"

const express = require('express');
const router = express.Router();
const user = require('../service/user');
const user1 = require('../domain/entity/user')
const authFacebook = require('../domain/entity/auth.facebook');
const fb = require('fb-mini');
// POST /sign/up
router.post('/up', (req, res) => {

    const nickname = req.body.nickname;
    const birth = req.body.birth;
    const gender = req.body.gender
    const accessToken = req.body.accessToken;

    if(accessToken === null || accessToken === ''){

        res.status(401).json({});
        return;
    }
    fb.get('v2.7/me?fields=id,name', accessToken, {limit: 3, redirect : false}, function(err, response, statusCode) {

        user.findAll(nickname)
            .then((data1) => {

                if(data1.length >= 1 ) {

                    console.log('닉네임중복')
                    res.status(409).json({});
                    return;
                }
                user.create(nickname, birth, gender)
                    .then((cursor) => {

                        user.createFB(response.id, cursor.id)
                            .then((cursor2) => {

                                res.status(201).json({ body : {
                                    "id" : cursor2.id,
                                    "nickname" : nickname,
                                    "birth" : birth,
                                    "gender" : gender
                                }})
                                return;
                            })
                            .catch(() => {

                                res.status(500).json({});
                                return;
                            })
                        })
                        .catch(() => {

                            console.log('항목 비어있음')
                            res.status(412).json({});
                            return;
                        })
                    })
                    .catch(() =>{

                        res.status(500).json({});
                        return;
                    });
                });

});


// POST /sign/in
router.post('/in', (req, res) => {

    const accessToken = req.body.accessToken;

    if(accessToken === null || accessToken ==='' && req.session != undefined || req.session.userId != undefined) {

        res.status(401).json({});
        return;
    }
    fb.get('v2.7/me?fields=id,name', accessToken, {limit : 3, redirect : false}, function(err, response, statusCode) {

        user.findAndCount(response.id)
            .then((data) => {

                if (!data) {

                    console.log('가입안됨');
                    res.status(404).json({});
                    return;
                }
                user.findUser(data.userId)
                    .then((data1) => {

                        req.session.user_id = response.id;
                        req.session.user_name = data1.name;
                        res.status(200).json({ body : {
                            "id" : data1.id,
                            "nickname" : data1.name,
                            "birth" : data1.birth,
                            "gender" : data1.gender
                        }});
                    })
                    .catch(() => {

                        res.status(500).json({});
                        return;
                    })
                })
                .catch(() => {

                    res.status(500).json({});
                    return;
                })
            })

});

// POST /sign/out
router.post('/out', (req, res) => {

    const accessToken = req.body.userId;

    if (req.session === undefined || req.session.user_id === undefined) {

        console.log('세션없음')
        res.status(401).json({});
        return;
    }
    const query = "delete from sys_user_session where session_id = '" + req.sessionID + "';"

    user1.sequelize.query(query).spread((result, metadata) => {

        req.session = undefined;
        res.clearCookie('session_id');
        res.status(204).json({});
    });

});

module.exports = router;
