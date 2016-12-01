const artist = require('../domain/entity/artist');
const interest = require('../domain/entity/interest.artist');
const artistTrack = require('../domain/entity/track.compose');
const track = require('../domain/entity/track');
const tagGenre = require('../domain/entity/tag.genre');
const tag = require('../domain/entity/tag');

module.exports = {

    findDetail : function(artistId) { return artist.findAll({ where : { id : artistId }}); },
    findQueryAll : function(query, before, count) { return artist.findAll({ where : { name : { $like : '%'+query+'%'}, id :{$lt : before} }, order :[['id', 'DESC']], limit : count  }); },
    //searchArtists : function(query, before, count){ return artist.findAll({ where : { name : query }, limit : count }); },
    findAll : function(before, count){ return  artist.findAll({ where : { id :{$lt : before} }, limit : count, order :[['id', 'DESC']] }); },
    findProfile : function (id, profile) { return artist.findOne({ where : { id : id} }); },
    findArtistTrack : function(id, before, count) { return artistTrack.findAll({
              where:{ artistId : id, trackId : {$lt : before} },
              include : [ {model : track, include : [{model : tagGenre, include : [tag]}]}],
              limit : count, order : 'trackId DESC'
            });
        },
    findArtistUserId : function(artistids, before, count) { return artist.findAll({ where : { id : {$and : { $or : artistids , $lt : before}}}, order : [['id','DESC']], limit : count})},
    findInterUserId : function(userId) { return interest.findAll({ where : { userId : userId}}); },
    addLike : function(id, userId) { return interest.create( { artistId: id, userId : userId } ); },
    deleteLike : function(artistId, userId) { return interest.destroy( { where :{ artistId : artistId, userId : userId} }); },
    addArtist : function(name, profile, link) { return artist.create({ name : name, profile : profile, link : link }) ;},
    modifyArtist : function(id, name, profile, link) { return artist.update({ name : name, profile : profile, link : link }, {where : { id : id }}); },
    deleteArtist : function(id) { return artist.destroy({ where : { id : id }}); },

};
