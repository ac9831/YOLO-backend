const sequelize = require('sequelize');
const model = require('../../config/model');

const holder = model.define('holder', {

    name : { type : sequelize.STRING, allowNull : false }
});

module.exports = holder;
