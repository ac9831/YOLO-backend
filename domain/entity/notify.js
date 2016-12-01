const sequelize = require('sequelize');
const model = require('../../config/model');

const notify = model.define('notify', {

    message : { type : sequelize.STRING, allowNull : false },
    type : { type : model.purpose, allowNull : false }
});

module.exports = notify;
