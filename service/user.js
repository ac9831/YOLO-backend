'use strict';

const user = require('../domain/entity/user');
const track = require('../domain/entity/track');
const tag = require('../domain/entity/tag');
const genre = require('../domain/entity/tag.genre');
const authFacebook = require('../domain/entity/auth.facebook');

module.exports = {
  findById : function (id) { return user.findById(id); },
  findAndCount : function(userId){ return  authFacebook.findOne({ where : { facebookId : userId }}); },
  findUser : function(userId){ return user.findOne({ where : { id : userId}})},
  findAll : function(nickname) { return user.findAll({ where : {name : nickname}})},
  create : function (nickname, birth, gender) {
    return user.create({
        name : nickname,
        birth : birth,
        gender : gender
      });
  },
  createFB : function (facebookId, userId) {
    return authFacebook.create({
        facebookId : facebookId,
        userId : userId
      });
  },

  getTrack : function(id) { return user.findOne({ where : { id : id }, include : [ track ] }); },
  getGenres : function(ides) {
    let query = 'select distinct tagId from tag_genres where ';
    for(let i=0; i<ides.length;i++) {

      if(i===ides.length-1) { query += 'trackId = ' + ides[i]; }
      else { query += 'trackId = ' + ides[i] + ' or '; }

    }

    return genre.sequelize.query(query);
  },
  getTag : function(ides) { return tag.findAll({ where : { $or : ides }}); },
  destroy : function(id) { return user.destroy({ where : {id : id} }); }

};
