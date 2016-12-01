const sequelize = require('sequelize');
const model = require('../../config/model');

const token = model.define('photo', {

    link : { type : sequelize.TEXT, allowNull : false }
});

module.exports = token;
