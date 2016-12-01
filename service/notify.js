
const notify = require('../domain/entity/notify');
const record = require('../domain/entity/notify.record');



module.exports = {

    findAll : function(before, count){ return  notify.findAll({ where : { id :{$lt : before} }, limit : count, include : [record], order :[['id', 'DESC']] }); },
    findRecord : function(notifyId){ return record.findOne({ where : {notifyId : notifyId}}); },
    addRead : function(notifyId, userId) { return record.create( { notifyId: notifyId, userId : userId , read : true} ); },



};
