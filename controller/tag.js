"use strict"

const express = require('express');
const router = express.Router();
const tag = require('../domain/entity/tag');
const artist = require('../service/artist');
const track = require('../service/track');


// > GET /tags/:id?before={before}&count={count}
router.get('/:id', (req, res) => {

    // 아티스트 : /artists/:id 와 동일한 결과 제공
    // 장르 : 관련 트랙
    // 해시태그 : 미정 - 커뮤니티 기능 설계가 완료되면 진행
    // 해시 태그 아직 안됨

    const id = parseInt(req.params.id);

    if (id === null || id === ' ') {

        res.status(412).json({});
        return;
    }
    tag.findOne({ where : { id : id } })
       .then((data) => {
           const type = data.type;

           if(type === 'artist') {
               // feeds 부분 처리 어떻게?
               return artist.findDetail(data.artistId)
                            .then((artist) => {
                                res.status(200).json({
                                    body : {
                                        "artists" : artist
                                    }
                                });
                                return;
                            })
                            .catch(() => {

                                res.status(500).json({});
                                return;
                            });

           }else if(type === 'genre') {
               // 트랙에 장르를 다시 넣을려면 코드가 매우 복잡해진다.
               // 상의 해야 할 부분
               return track.findTrack(id)
                           .then((trackDatas) => {
                               let trackids = [];
                               for(let i=0;i<trackDatas.length;i++) {
                                   trackids.push(trackDatas[i].trackId);
                               }
                               return track.findOrTrack(trackids)
                                           .then((trackData) => {

                                               const sumTag = () => {
                                                   return new Promise((resolve, reject) =>{
                                                       for(let i = 0;i < trackData.length; i++){
                                                           console.log(trackData[i].id);
                                                           track.findGenreTag(trackData[i].id)
                                                                .then((tagData) => {
                                                                    trackData[i].genres = tagData;
                                                                    if(i === trackData.length-1) {
                                                                        resolve(genreRet);
                                                                    }
                                                                })
                                                                .catch((e) => {

                                                                    console.log(e);
                                                                    reject(e);
                                                                    return;
                                                                });
                                                       }
                                                   });
                                               }

                                               sumTag().then(() => {
                                                   res.status(200).json({
                                                       body : {
                                                           "genres" : trackData
                                                       }
                                                   });
                                                   return;
                                               })
                                               .catch((e) => {
                                                   console.log(e);
                                                   res.sendStatus(500);
                                                   return;
                                               });


                                           })
                                           .catch(() => {

                                               res.status(500).json({});
                                               return;
                                            } );

                           })
                           .catch(() => {
                               res.status(500).json({});
                               return;
                           });
           }

       })
       .catch(() => { res.status(500).json({}); return; });




});

module.exports = router;
