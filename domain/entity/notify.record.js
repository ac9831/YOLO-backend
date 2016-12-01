const sequelize = require('sequelize');
const model = require('../../config/model');

const record = model.define('notify_record', {

    read : { type : sequelize.DATE, allowNull : true }
});

module.exports = record;
