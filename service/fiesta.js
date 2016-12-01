"use strict"

const fiesta = require('../domain/entity/fiesta');
const purchase = require('../domain/entity/fiesta.purchase');
const photo = require('../domain/entity/fiesta.photo');
const perform = require('../domain/entity/fiesta.perform');
const interest = require('../domain/entity/interest.fiesta');
const artist = require('../domain/entity/artist');
const holder = require('../domain/entity/holder');
const holderHost = require('../domain/entity/holder.host');

module.exports = {
    findById : function(id) { return fiesta.findById(id); },
    findQueryAll : function(query, before, count) { return fiesta.findAll({ where : { name : { $like : '%'+query+'%'}, id : {$lt : before} }, order :[['id', 'DESC']], limit : count  }); },
    findAll : function(before, count) { return fiesta.findAll({ where : { id : { $lt : before } }, limit : count }); },
    findPurchase : function(id) { return purchase.findOne({ where : { fiestaId : id }}); },
    findPhotos : function(fiestaId) { return photo.findAll({ where : { fiestaId : fiestaId } }); },
    findPhoto : function(id) { return photo.findOne({ where : { id : id }}); },
    findPerform : function(id) { return perform.findAll({ where : { fiestaId : id } ,  include : [artist] }); },
    findUserStatus : function(id, status) { return interest.update({ state : status }, { where : { fiestaId : id } }); },
    findInterest : function(id) { return interest.findAll({where : {fiestaId : id} }); },
    findInterUserId : function(userId) { return interest.findAll({ where : { userId : userId }}); },
    findFiestaUserId : function(fiestaids, before, count) { return fiesta.findAll({ where : { id : {$and : { $or : fiestaids, $lt : before}}}, limit : count}); },
    createInterest : function(fiestaId, userId, status) { return interest.create({ fiestaId : fiestaId, userId : userId, state : status }); },
    findHeadlinerArtists : function(id, before, count) {
      return perform.findAll({
                where:{ fiestaId : id, artistId :{$lt : before} },
                include : [ artist ],
                limit : parseInt(count),
                order : 'artistId DESC'
              });
    },
    createFiesta : function(name, description, startTime, endTime, location, geolocation) {
      return fiesta.create({
                name : name,
                description : description,
                startTime : startTime,
                endTime : endTime,
                location : location,
                geolocation : geolocation
              });
    },
    createFiestaPhoto : function(id, path) { return photo.create({fiestaId : id, path : path }); },
    modifyFiestaPhoto : function(fiestaId, photoId, path) { return photo.update({ fiestaId : fiestaId, path : path }, { where : { id : photoId } }); },
    findFiestaPhoto : function(fiestaId, photoId) { return photo.findOne({ where : { id : photoId, fiestaId : fiestaId }}); },
    deleteFiestaPhoto : function(fiestaId, photoId) { return photo.destroy({ where : { id : photoId, fiestaId : fiestaId }}); },
    modifyFiesta : function(id, name, description, startTime, endTime, location, geolocation){
      return fiesta.update({
          name : name,
          description : description,
          startTime : startTime,
          endTime : endTime,
          location : location,
          geolocation : geolocation
      }, { where : { id : id } });
    },
    inputFiestaFacade : function(id, path){
      return new Promise((resolve) => {
        fiesta.update({ facade : path }, { where : { id : id } })
              .then((data) => { resolve(data); })
              .catch((e) => { console.log(e); });
      });
    },
    deleteFiesta : function(id) { return fiesta.destroy({ where : { id : id }}); },
    addPerform : function(fiestaId, artistId, startTime, endTime, stage, headliner) {
      return perform.create({
        fiestaId : fiestaId,
        artistId : artistId,
        startTime : startTime,
        endTime : endTime,
        stage : stage,
        headliner : headliner
      }); },
    modifyPerform : function(fiestaId, artistId, startTime, endTime, stage, headliner){
      return perform.update({
        startTime : startTime,
        endTime : endTime,
        stage : stage,
        headliner : headliner
      }, {where : { fiestaId : fiestaId, artistId : artistId }});
    },
    deletePerform : function(fiestaId, artistId) { return perform.destroy({ where : { fiestaId : fiestaId, artistId : artistId}}); }
};
