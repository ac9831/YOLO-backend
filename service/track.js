'use strict';

const track = require('../domain/entity/track');
const interest = require('../domain/entity/interest.track');
const tagGenre = require('../domain/entity/tag.genre');
const compose = require('../domain/entity/track.compose');
const tag = require('../domain/entity/tag');

module.exports = {

    findQueryAll : function(query, before, count) { return track.findAll({ where : { title : { $like : '%'+query+'%'}, id : {$lt : before} }, order :[['id', 'DESC']], limit : count  }); },
    addLike : function(trackId, userId) { return interest.create({ trackId: trackId, userId : userId }); },
    deleteLike : function(trackId, userId) { return interest.destroy({ where : { trackId : trackId, userId : userId}}); },
    findLike : function(trackId, userId) { return interest.findAll({ where : { trackId : trackId, userId : userId }}); },
    findAllLike : function(userId) { return interest.findAll({ where : { userId : userId }}); },
    findTrackUserId : function(trackids, before, count) { return track.findAll({ where : { id : {$and : {$or : trackids, $lt : before}}}, limit : count }); },
    addTrack : function(title, rank, link, dropAt, release) {
        return track.create({
            title : title,
            rank : rank,
            link : link,
            dropAt : dropAt,
            release : release
        });
    },
    addGenre : function(trackId, tagId) { return tagGenre.create({ trackId : trackId, tagId : tagId}); },
    addCompose : function(trackId, artistId) { return compose.create({ trackId : trackId, artistId : artistId }); },
    deleteGenre : function(trackId, tagId) { return tagGenre.destroy({ where : { trackId : trackId, tagId : tagId }}); },
    deleteCompose : function(trackId, artistId) { return compose.destroy({ where : { trackId : trackId, artistId : artistId }}); },
    findTrack : function(tagId) { return tagGenre.findAll({ where : { tagId : tagId }}); },
    findOrTrack : function(trackids) { return track.findAll({ where : {id : { $or :  trackids  }}}); },
    findGenreTag : function(tagId) { return tagGenre.findAll({ where : { tagId : tagId}, include : [ tag ] }); }
};
