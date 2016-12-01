const sequelize = require('sequelize');
const model = require('../../config/model');

const token = model.define('notify_token', {

    type : { type : model.device, allowNull : false },
    token : { type : sequelize.TEXT, allowNull : false }
});

module.exports = token;
