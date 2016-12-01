"use strict"

const holder = require('../domain/entity/holder');
const holderHost = require('../domain/entity/holder.host');

module.exports = {
    addHolders : function(name) { return holder.create({ name : name }); },
    modifyHolders : function(id, name) { return holder.update({ name : name }, {where : { id : id }}); },
    deleteHolders : function(id) { return holder.destroy({ where : { id : id }}); },
    addHolderHost : function(fiestaId, holderId) { return holderHost.create({ fiestaId : fiestaId, holderId : holderId }); },
    deleteHolderHost : function(fiestaId, holderId) { return holderHost.destroy({ where : { fiestaId : fiestaId, holderId : holderId}}); },
    findHolders : function(fiestaId, holderId) { return holderHost.findOne({ where : { fiestaId : fiestaId, holderId : holderId }}); }
};
